import type { Post } from "../../services/posts";

type PostMetaProps = {
  post: Pick<Post, "author" | "createdAt" | "tags">;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-text-subtle">
      <span>{post.author.name}</span>
      <span aria-hidden="true">/</span>
      <time dateTime={post.createdAt}>
        {dateFormatter.format(new Date(post.createdAt))}
      </time>
      {post.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 font-semibold text-primary-light"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
