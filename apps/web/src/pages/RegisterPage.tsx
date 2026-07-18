import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/organisms/AuthLayout";
import RegisterForm from "../components/organisms/RegisterForm";
import { getAuthErrorMessage, register } from "../services/auth";

const registerFields = [
  {
    id: "name",
    label: "Nome completo",
    type: "text",
    placeholder: "João da Silva",
  },
  {
    id: "email",
    label: "E-mail",
    type: "email",
    placeholder: "seu@exemplo.com",
  },
  { id: "password", label: "Senha", type: "password", placeholder: "••••••••" },
  {
    id: "confirmPassword",
    label: "Confirmar senha",
    type: "password",
    placeholder: "••••••••",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (values: Record<string, string>) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate("/login", {
        replace: true,
        state: { message: "Cadastro criado com sucesso. Faça login." },
      });
    } catch (err) {
      setError(getAuthErrorMessage(err, "Não foi possível criar sua conta."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      bannerSrc="/banner-login.png"
      title="Crie sua conta"
      subtitle="Cadastre-se para acessar o CodeConnect"
      form={
        <RegisterForm
          fields={registerFields}
          submitLabel="Criar conta"
          onSubmit={handleRegister}
          error={error}
          isSubmitting={isSubmitting}
        />
      }
      footerLink={{
        label: "Já tenho conta",
        href: "/login",
      }}
    />
  );
}
