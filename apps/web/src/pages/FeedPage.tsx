import { useEffect, useState } from "react";
import FeedLayout from "../components/layouts/FeedLayout";
import PostCard from "../components/feed/PostCard";
import PostComposer from "../components/feed/PostComposer";
import Input from "../components/atoms/Input";
import {
  createPost,
  getPostErrorMessage,
  likePost,
  listPosts,
  unlikePost,
  type CreatePostPayload,
  type Post,
} from "../services/posts";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyPostId, setBusyPostId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      listPosts(search)
        .then(setPosts)
        .catch((err) => {
          setError(getPostErrorMessage(err, "Não foi possível carregar o feed."));
        })
        .finally(() => setIsLoading(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const handleCreatePost = async (payload: CreatePostPayload) => {
    setIsSubmitting(true);
    setComposerError(null);

    try {
      const createdPost = await createPost(payload);
      setPosts((current) => [createdPost, ...current]);
      return true;
    } catch (err) {
      setComposerError(
        getPostErrorMessage(err, "Não foi possível publicar o post."),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (post: Post) => {
    setBusyPostId(post.id);

    try {
      const updatedPost = post.likedByCurrentUser
        ? await unlikePost(post.id)
        : await likePost(post.id);

      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                likesCount: updatedPost.likesCount,
                likedByCurrentUser: updatedPost.likedByCurrentUser,
              }
            : item,
        ),
      );
    } catch (err) {
      setError(getPostErrorMessage(err, "Não foi possível atualizar a curtida."));
    } finally {
      setBusyPostId(null);
    }
  };

  return (
    <FeedLayout>
      {({ user, isSessionLoading }) => (
        <div className="mx-auto max-w-5xl space-y-6">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-light">
                Feed
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Posts da comunidade
              </h1>
            </div>
            <div className="w-full md:max-w-sm">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por React, NodeJS, hooks..."
                aria-label="Buscar posts"
              />
            </div>
          </header>

          {user && (
            <PostComposer
              isSubmitting={isSubmitting}
              error={composerError}
              onSubmit={handleCreatePost}
            />
          )}

          {!user && !isSessionLoading && (
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              Entre com sua conta para criar posts, curtir e comentar.
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error-light">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-lg border border-white/10 bg-[#111820] p-6 text-sm text-neutral-text-muted">
              Carregando posts...
            </div>
          ) : posts.length > 0 ? (
            <section className="grid gap-5 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canInteract={Boolean(user)}
                  isBusy={busyPostId === post.id}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </section>
          ) : (
            <div className="rounded-lg border border-white/10 bg-[#111820] p-6 text-sm text-neutral-text-muted">
              Nenhum post encontrado.
            </div>
          )}
        </div>
      )}
    </FeedLayout>
  );
}
