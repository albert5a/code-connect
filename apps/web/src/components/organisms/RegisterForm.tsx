import { useMemo, useState } from "react";
import Button from "../atoms/Button";
import CheckboxField from "../molecules/CheckboxField";
import DividerText from "../molecules/DividerText";
import FormField from "../molecules/FormField";
import SocialLoginButtons from "../molecules/SocialLoginButtons";

export type AuthField = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
};

interface RegisterFormProps {
  fields: AuthField[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
}

export default function RegisterForm({
  fields,
  submitLabel,
  onSubmit,
}: RegisterFormProps) {
  const initialValues = useMemo(
    () =>
      fields.reduce<Record<string, string>>(
        (acc, field) => ({ ...acc, [field.id]: "" }),
        {},
      ),
    [fields],
  );

  const [values, setValues] = useState(initialValues);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }));
  };

  const validate = () => {
    setErrors(null);
    const email = values.email || "";
    const password = values.password || "";
    const confirm = values.confirmPassword || "";

    if (!values.name) return "Nome é obrigatório.";
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return "E-mail inválido.";
    if (password.length < 8) return "Senha deve ter pelo menos 8 caracteres.";
    if (password !== confirm) return "Senhas não batem.";
    if (!acceptedTerms) return "Aceite os termos para continuar.";

    return null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const err = validate();
    if (err) {
      setErrors(err);
      return;
    }
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-3xl bg-slate-950/90 p-5 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.75)] ring-1 ring-white/10">
        {fields.map((field) => (
          <FormField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.id]}
            onChange={(value) => handleChange(field.id, value)}
          />
        ))}

        <div className="flex items-center justify-between">
          <CheckboxField
            label="Aceito os termos e políticas"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms((p) => !p)}
          />
        </div>

        {errors && <p className="mt-2 text-sm text-red-400">{errors}</p>}

        <Button type="submit" className="w-full">
          {submitLabel} →
        </Button>
      </div>

      <DividerText text="ou crie com outras contas" />
      <SocialLoginButtons />
    </form>
  );
}
