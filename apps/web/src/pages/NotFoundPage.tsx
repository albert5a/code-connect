import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-bg text-neutral-text px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Página não encontrada</p>
        <p className="text-neutral-text-subtle mb-8">
          Desculpe, a página que você está procurando não existe.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
        >
          Voltar para Login
        </Link>
      </div>
    </div>
  );
}
