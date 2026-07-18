import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/atoms/Button";
import FeedLayout from "../components/layouts/FeedLayout";
import PostActions from "../components/feed/PostActions";
import PostMeta from "../components/feed/PostMeta";
import PostThumbnail from "../components/feed/PostThumbnail";
import {
  commentPost,
  getPost,
  getPostErrorMessage,
  likePost,
  unlikePost,
  type PostDetails,
} from "../services/posts";

const textareaClass =
  "w-full rounded-2xl border border-neutral-border/30 bg-neutral-bg/90 px-4 py-3 text-sm text-neutral-text shadow-sm outline-none transition duration-200 placeholder:text-neutral-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<PostDetails | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeBusy, setIsLikeBusy] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    if (!postId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    getPost(postId)
      .then(setPost)
      .catch((err) => {
        setError(getPostErrorMessage(err, "Não foi possível carregar o post."));
      })
      .finally(() => setIsLoading(false));
  }, [postId]);

  const handleToggleLike = async () => {
    if (!post) {
      return;
    }

    setIsLikeBusy(true);

    try {
      const updatedPost = post.likedByCurrentUser
        ? await unlikePost(post.id)
        : await likePost(post.id);
      setPost(updatedPost);
    } catch (err) {
      setError(getPostErrorMessage(err, "Não foi possível atualizar a curtida."));
    } finally {
      setIsLikeBusy(false);
    }
  };

  const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!post || !comment.trim()) {
      return;
    }

    setIsCommenting(true);
    setCommentError(null);

    try {
      const createdComment = await commentPost(post.id, comment.trim());
      setPost((current) =>
        current
          ? {
              ...current,
              comments: [...current.comments, createdComment],
              commentsCount: current.commentsCount + 1,
            }
          : current,
      );
      setComment("");
    } catch (err) {
      setCommentError(
        getPostErrorMessage(err, "Não foi possível comentar no post."),
      );
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <FeedLayout>
      {({ user, isSessionLoading }) => (
        <div className="mx-auto max-w-4xl space-y-6">
          <Link
            to="/posts"
            className="inline-flex rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-neutral-text-muted transition hover:border-primary/60 hover:text-primary-light"
          >
            Voltar ao feed
          </Link>

          {isLoading && (
            <div className="rounded-lg border border-white/10 bg-[#111820] p-6 text-sm text-neutral-text-muted">
              Carregando post...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error-light">
              {error}
            </div>
          )}

          {post && (
            <>
              <article className="overflow-hidden rounded-lg border border-white/10 bg-[#111820]">
                <div className="aspect-[16/8] min-h-56 overflow-hidden">
                  <PostThumbnail
                    src={post.thumbnailUrl}
                    title={post.title}
                    tags={post.tags}
                  />
                </div>
                <div className="space-y-6 p-5 sm:p-7">
                  <PostMeta post={post} />
                  <div className="space-y-3">
                    <h1 className="text-3xl font-semibold leading-tight text-white">
                      {post.title}
                    </h1>
                    <p className="text-base leading-7 text-neutral-text-muted">
                      {post.excerpt}
                    </p>
                  </div>
                  <PostActions
                    likesCount={post.likesCount}
                    commentsCount={post.commentsCount}
                    liked={post.likedByCurrentUser}
                    canInteract={Boolean(user)}
                    isBusy={isLikeBusy}
                    onToggleLike={handleToggleLike}
                  />
                  <div className="whitespace-pre-line border-t border-white/10 pt-6 text-base leading-8 text-neutral-text">
                    {post.content}
                  </div>
                </div>
              </article>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Comentários
                </h2>

                {user ? (
                  <form
                    onSubmit={handleComment}
                    className="space-y-3 rounded-lg border border-white/10 bg-[#111820] p-4"
                  >
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      className={`${textareaClass} min-h-28 resize-y`}
                      maxLength={1000}
                      required
                    />
                    {commentError && (
                      <p className="text-sm text-error-light">{commentError}</p>
                    )}
                    <Button type="submit" disabled={isCommenting}>
                      {isCommenting ? "Comentando..." : "Comentar"}
                    </Button>
                  </form>
                ) : (
                  !isSessionLoading && (
                    <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                      Entre com sua conta para comentar.
                    </div>
                  )
                )}

                <div className="space-y-3">
                  {post.comments.length > 0 ? (
                    post.comments.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-lg border border-white/10 bg-[#111820] p-4"
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-text-subtle">
                          <span className="font-semibold text-neutral-text-muted">
                            {item.author.name}
                          </span>
                          <span aria-hidden="true">/</span>
                          <time dateTime={item.createdAt}>
                            {new Intl.DateTimeFormat("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(item.createdAt))}
                          </time>
                        </div>
                        <p className="whitespace-pre-line text-sm leading-6 text-neutral-text">
                          {item.content}
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-lg border border-white/10 bg-[#111820] p-5 text-sm text-neutral-text-muted">
                      Nenhum comentário ainda.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </FeedLayout>
  );
}
