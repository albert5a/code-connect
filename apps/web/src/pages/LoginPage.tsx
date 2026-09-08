import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/organisms/AuthLayout";
import AuthForm from "../components/organisms/AuthForm";
import { getAuthErrorMessage, login } from "../services/auth";

const loginFields = [
  {
    id: "email",
    label: "E-mail",
    type: "email",
    placeholder: "seu@exemplo.com",
  },
  {
    id: "password",
    label: "Senha",
    type: "password",
    placeholder: "••••••••",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successMessage =
    typeof location.state === "object" &&
    location.state !== null &&
    "message" in location.state
      ? String(location.state.message)
      : null;

  const handleLogin = async (
    values: Record<string, string>,
    remember: boolean,
  ) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await login(
        {
          email: values.email,
          password: values.password,
        },
        remember,
      );
      navigate("/posts", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err, "Não foi possível fazer login."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      bannerSrc="/banner-login.png"
      title="Login"
      subtitle="Boas-vindas! Faça seu login."
      form={
        <>
          {successMessage && (
            <p className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-light">
              {successMessage}
            </p>
          )}
          <AuthForm
            fields={loginFields}
            submitLabel="Login"
            onSubmit={handleLogin}
            error={error}
            isSubmitting={isSubmitting}
          />
        </>
      }
      footerLink={{
        label: "Crie seu cadastro!",
        href: "/register",
      }}
    />
  );
}
