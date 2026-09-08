import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import PostActions from "./PostActions";
import PostMeta from "./PostMeta";
import PostThumbnail from "./PostThumbnail";

type PostCardProps = {
  post: Post;
  canInteract: boolean;
  isBusy?: boolean;
  onToggleLike: (post: Post) => void;
};

export default function PostCard({
  post,
  canInteract,
  isBusy,
  onToggleLike,
}: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-[#111820] shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
      <Link
        to={`/posts/${post.id}`}
        className="block aspect-[16/9] overflow-hidden bg-[#16201d]"
      >
        <PostThumbnail
          src={post.thumbnailUrl}
          title={post.title}
          tags={post.tags}
        />
      </Link>
      <div className="space-y-4 p-5">
        <PostMeta post={post} />
        <div className="space-y-2">
          <Link
            to={`/posts/${post.id}`}
            className="block text-xl font-semibold leading-snug text-white transition hover:text-primary-light"
          >
            {post.title}
          </Link>
          <p className="text-sm leading-6 text-neutral-text-muted">
            {post.excerpt}
          </p>
        </div>
        <PostActions
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          liked={post.likedByCurrentUser}
          canInteract={canInteract}
          isBusy={isBusy}
          onToggleLike={() => onToggleLike(post)}
        />
      </div>
    </article>
  );
}
