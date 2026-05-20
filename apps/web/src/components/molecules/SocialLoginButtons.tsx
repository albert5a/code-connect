import SocialIcon from '../atoms/SocialIcon'

const providers = [
  { name: 'GitHub', icon: '/github.png' },
  { name: 'Gmail', icon: '/google.png' },
]

export default function SocialLoginButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/50 hover:bg-slate-900"
          onClick={() => console.log(`Entrar com ${provider.name}`)}
        >
          <SocialIcon src={provider.icon} alt={provider.name} />
          {provider.name}
        </button>
      ))}
    </div>
  )
}
