import SocialIcon from "../atoms/SocialIcon";

const providers = [
  { name: "GitHub", icon: "/github.png" },
  { name: "Gmail", icon: "/google.png" },
];

export default function SocialLoginButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-3xl border border-neutral-border/30 bg-neutral-bg/90 px-4 py-4 text-sm font-semibold text-neutral-text transition hover:border-primary/50 hover:bg-neutral-bg-alt"
          onClick={() => console.log(`Entrar com ${provider.name}`)}
        >
          <SocialIcon src={provider.icon} alt={provider.name} />
          {provider.name}
        </button>
      ))}
    </div>
  );
}
