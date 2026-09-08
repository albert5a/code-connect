import { useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import type { CreatePostPayload } from "../../services/posts";

type PostComposerProps = {
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (payload: CreatePostPayload) => Promise<boolean>;
};

const fieldClass =
  "w-full rounded-2xl border border-neutral-border/30 bg-neutral-bg/90 px-4 py-3 text-sm text-neutral-text shadow-sm outline-none transition duration-200 placeholder:text-neutral-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function PostComposer({
  isSubmitting,
  error,
  onSubmit,
}: PostComposerProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const wasCreated = await onSubmit({
      title,
      excerpt,
      content,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    if (!wasCreated) {
      return;
    }

    setTitle("");
    setExcerpt("");
    setContent("");
    setThumbnailUrl("");
    setTags("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-white/10 bg-[#111820] p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-neutral-text">
          Título
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={3}
            maxLength={120}
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-neutral-text">
          Tags
          <Input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="React, NodeJS"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-neutral-text">
        Resumo
        <Input
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          minLength={10}
          maxLength={220}
          required
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-neutral-text">
        Conteúdo
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className={`${fieldClass} min-h-32 resize-y`}
          minLength={20}
          required
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-neutral-text">
        Thumbnail
        <Input
          value={thumbnailUrl}
          onChange={(event) => setThumbnailUrl(event.target.value)}
          type="url"
          placeholder="https://..."
        />
      </label>
      {error && <p className="text-sm text-error-light">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Publicando..." : "Publicar"}
      </Button>
    </form>
  );
}
