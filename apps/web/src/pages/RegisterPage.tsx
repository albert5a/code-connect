import AuthLayout from "../components/organisms/AuthLayout";
import RegisterForm from "../components/organisms/RegisterForm";

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
  const handleRegister = (values: Record<string, string>) => {
    console.log("register values", values);
    // TODO: chamar API de cadastro
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
        />
      }
      footerLink={{
        label: "Já tenho conta",
        href: "/login",
      }}
    />
  );
}