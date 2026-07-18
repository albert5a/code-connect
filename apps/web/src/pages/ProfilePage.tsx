import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/atoms/Button";
import {
  clearAuthToken,
  getAuthErrorMessage,
  getAuthToken,
  getMe,
  type AuthUser,
} from "../services/auth";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login", { replace: true });
      return;
    }

    let isMounted = true;

    getMe()
      .then((profile) => {
        if (isMounted) {
          setUser(profile);
        }
      })
      .catch((err) => {
        clearAuthToken();
        if (isMounted) {
          setError(
            getAuthErrorMessage(err, "Sessão expirada. Faça login novamente."),
          );
        }
        navigate("/login", { replace: true });
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-neutral-bg px-4 py-10 text-neutral-text sm:px-6 sm:py-14">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-[32px] bg-neutral-bg-alt/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.65)] ring-1 ring-overlay-lighter sm:p-10">
        <div className="flex flex-col gap-4 border-b border-overlay-lighter pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-light/80">
              Perfil
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              CodeConnect
            </h1>
          </div>
          <Button type="button" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        {isLoading && (
          <p className="text-sm text-neutral-text-muted">Carregando perfil...</p>
        )}

        {error && <p className="text-sm text-error">{error}</p>}

        {user && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-overlay-lighter bg-neutral-bg/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-text-subtle">
                Nome
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {user.name}
              </p>
            </div>
            <div className="rounded-2xl border border-overlay-lighter bg-neutral-bg/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-text-subtle">
                E-mail
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
