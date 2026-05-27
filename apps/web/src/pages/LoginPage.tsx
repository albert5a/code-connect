import AuthLayout from "../components/organisms/AuthLayout";
import AuthForm from "../components/organisms/AuthForm";

const loginFields = [
  {
    id: "username",
    label: "Email ou usuário",
    type: "text",
    placeholder: "usuario123",
  },
  {
    id: "password",
    label: "Senha",
    type: "password",
    placeholder: "••••••••",
  },
];

export default function LoginPage() {
  const handleLogin = (values: Record<string, string>, remember: boolean) => {
    console.log("login values", values, remember);
  };

  return (
    <AuthLayout
      bannerSrc="/banner-login.png"
      title="Login"
      subtitle="Boas-vindas! Faça seu login."
      form={
        <AuthForm
          fields={loginFields}
          submitLabel="Login"
          onSubmit={handleLogin}
        />
      }
      footerLink={{
        label: "Crie seu cadastro!",
        href: "/register",
      }}
    />
  );
}
