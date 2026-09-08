import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

type PostWithSummary = Prisma.PostGetPayload<{
  include: {
    author: { select: { id: true; name: true } };
    likes: { select: { id: true } };
    _count: { select: { likes: true; comments: true } };
  };
}>;

type PostWithDetails = Prisma.PostGetPayload<{
  include: {
    author: { select: { id: true; name: true } };
    likes: { select: { id: true } };
    comments: {
      include: { author: { select: { id: true; name: true } } };
      orderBy: { createdAt: 'asc' };
    };
    _count: { select: { likes: true; comments: true } };
  };
}>;

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: { author: { select: { id: true; name: true } } };
}>;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, currentUserId?: string | null) {
    const term = search?.trim();

    if (term) {
      const tagTerm = `%${term}%`;
      const rows = await this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT "id"
        FROM "posts"
        WHERE to_tsvector(
          'portuguese',
          coalesce("title", '') || ' ' ||
          coalesce("excerpt", '') || ' ' ||
          coalesce("content", '')
        ) @@ plainto_tsquery('portuguese', ${term})
        OR EXISTS (
          SELECT 1 FROM unnest("tags") AS "tag"
          WHERE "tag" ILIKE ${tagTerm}
        )
        ORDER BY ts_rank(
          to_tsvector(
            'portuguese',
            coalesce("title", '') || ' ' ||
            coalesce("excerpt", '') || ' ' ||
            coalesce("content", '')
          ),
          plainto_tsquery('portuguese', ${term})
        ) DESC, "created_at" DESC
      `);

      if (rows.length === 0) {
        return [];
      }

      const positionById = new Map(rows.map((row, index) => [row.id, index]));
      const posts = await this.prisma.post.findMany({
        where: { id: { in: rows.map((row) => row.id) } },
        include: this.summaryInclude(currentUserId),
      });

      return posts
        .sort(
          (a, b) =>
            (positionById.get(a.id) ?? 0) - (positionById.get(b.id) ?? 0),
        )
        .map((post) => this.toSummary(post));
    }

    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.summaryInclude(currentUserId),
    });

    return posts.map((post) => this.toSummary(post));
  }

  async findOne(id: string, currentUserId?: string | null) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.detailsInclude(currentUserId),
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return this.toDetails(post);
  }

  async create(createPostDto: CreatePostDto, authorId: string) {
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        excerpt: createPostDto.excerpt,
        content: createPostDto.content,
        thumbnailUrl: createPostDto.thumbnailUrl?.trim() || null,
        tags: this.normalizeTags(createPostDto.tags),
        authorId,
      },
      include: this.summaryInclude(authorId),
    });

    return this.toSummary(post);
  }

  async like(postId: string, userId: string) {
    await this.ensurePostExists(postId);
    await this.prisma.postLike
      .create({
        data: { postId, userId },
      })
      .catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          return null;
        }

        throw error;
      });

    return this.findOne(postId, userId);
  }

  async unlike(postId: string, userId: string) {
    await this.ensurePostExists(postId);
    await this.prisma.postLike.deleteMany({
      where: { postId, userId },
    });

    return this.findOne(postId, userId);
  }

  async comment(postId: string, userId: string, createCommentDto: CreateCommentDto) {
    await this.ensurePostExists(postId);

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        authorId: userId,
        content: createCommentDto.content,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    return this.toComment(comment);
  }

  private summaryInclude(currentUserId?: string | null) {
    return {
      author: {
        select: { id: true, name: true },
      },
      likes: {
        where: currentUserId ? { userId: currentUserId } : { userId: '' },
        select: { id: true },
      },
      _count: {
        select: { likes: true, comments: true },
      },
    } satisfies Prisma.PostInclude;
  }

  private detailsInclude(currentUserId?: string | null) {
    return {
      ...this.summaryInclude(currentUserId),
      comments: {
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    } satisfies Prisma.PostInclude;
  }

  private async ensurePostExists(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
  }

  private normalizeTags(tags?: string[]) {
    if (!tags) {
      return [];
    }

    return Array.from(
      new Set(
        tags
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => tag.slice(0, 32)),
      ),
    ).slice(0, 8);
  }

  private toSummary(post: PostWithSummary) {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      tags: post.tags,
      author: post.author,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      likedByCurrentUser: post.likes.length > 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private toDetails(post: PostWithDetails) {
    return {
      ...this.toSummary(post),
      comments: post.comments.map((comment) => this.toComment(comment)),
    };
  }

  private toComment(comment: CommentWithAuthor) {
    return {
      id: comment.id,
      content: comment.content,
      author: comment.author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
