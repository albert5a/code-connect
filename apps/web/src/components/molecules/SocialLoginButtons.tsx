import Button from "../atoms/Button";
import SocialIcon from "../atoms/SocialIcon";

const providers = [
  { name: "GitHub", icon: "/github.png" },
  { name: "Gmail", icon: "/google.png" },
];

export default function SocialLoginButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          type="button"
          variant="secondary"
          size="lg"
          className="gap-3"
          onClick={() => console.log(`Entrar com ${provider.name}`)}
        >
          <SocialIcon src={provider.icon} alt={provider.name} />
          {provider.name}
        </Button>
      ))}
    </div>
  );
}
