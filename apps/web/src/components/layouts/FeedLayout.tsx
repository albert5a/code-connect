import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  clearAuthToken,
  getAuthToken,
  getMe,
  type AuthUser,
} from "../../services/auth";

type FeedLayoutProps = {
  children: (session: {
    user: AuthUser | null;
    isSessionLoading: boolean;
  }) => ReactNode;
};

export default function FeedLayout({ children }: FeedLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!getAuthToken()) {
      setIsSessionLoading(false);
      return;
    }

    getMe()
      .then((profile) => {
        if (isMounted) {
          setUser(profile);
        }
      })
      .catch(() => {
        clearAuthToken();
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsSessionLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    navigate("/posts", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-neutral-text">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#111827]/95 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between gap-4 lg:min-h-full lg:flex-col lg:items-stretch">
            <div className="flex items-center gap-3 lg:block">
              <Link to="/posts" className="block text-xl font-semibold text-white">
                CodeConnect
              </Link>
              <p className="hidden text-sm text-neutral-text-muted lg:mt-2 lg:block">
                Acervo
              </p>
            </div>

            <nav className="flex items-center gap-2 lg:flex-1 lg:flex-col lg:items-stretch lg:pt-10">
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-primary text-neutral-bg"
                      : "text-neutral-text-muted hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                Feed
              </NavLink>
              {user && (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `hidden rounded-lg px-3 py-2 text-sm font-semibold transition sm:block ${
                      isActive
                        ? "bg-primary text-neutral-bg"
                        : "text-neutral-text-muted hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Perfil
                </NavLink>
              )}
            </nav>

            <div className="flex items-center gap-3 lg:flex-col lg:items-stretch">
              {user && (
                <p className="hidden truncate text-sm text-neutral-text-muted lg:block">
                  {user.name}
                </p>
              )}
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-neutral-text-muted transition hover:border-primary/60 hover:text-primary-light"
                >
                  Sair
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-neutral-text-muted transition hover:border-primary/60 hover:text-primary-light"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children({ user, isSessionLoading })}
        </div>
      </div>
    </main>
  );
}
