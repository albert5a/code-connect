type PostActionsProps = {
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  canInteract: boolean;
  isBusy?: boolean;
  onToggleLike?: () => void;
};

export default function PostActions({
  likesCount,
  commentsCount,
  liked,
  canInteract,
  isBusy = false,
  onToggleLike,
}: PostActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-text-muted">
      <button
        type="button"
        onClick={onToggleLike}
        disabled={!canInteract || isBusy}
        title={canInteract ? "Curtir post" : "Faça login para curtir"}
        className={`rounded-lg border px-3 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          liked
            ? "border-primary/50 bg-primary/15 text-primary-light"
            : "border-white/10 bg-white/[0.03] hover:border-primary/50 hover:text-primary-light"
        }`}
      >
        {liked ? "Curtido" : "Curtir"} · {likesCount}
      </button>
      <span className="rounded-lg border border-white/10 px-3 py-2">
        Comentários · {commentsCount}
      </span>
    </div>
  );
}
