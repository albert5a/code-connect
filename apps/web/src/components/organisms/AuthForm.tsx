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

interface AuthFormProps {
  fields: AuthField[];
  submitLabel: string;
  onSubmit: (
    values: Record<string, string>,
    remember: boolean,
  ) => void | Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
}

export default function AuthForm({
  fields,
  submitLabel,
  onSubmit,
  error,
  isSubmitting = false,
}: AuthFormProps) {
  const initialValues = useMemo(
    () =>
      fields.reduce<Record<string, string>>(
        (acc, field) => ({ ...acc, [field.id]: "" }),
        {},
      ),
    [fields],
  );

  const [values, setValues] = useState(initialValues);
  const [remember, setRemember] = useState(true);

  const handleChange = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit(values, remember);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-3xl bg-neutral-bg/90 p-5 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.75)] ring-1 ring-overlay-lighter">
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CheckboxField
            label="Lembrar-me"
            checked={remember}
            onChange={() => setRemember((prev) => !prev)}
          />
          <a
            href="#"
            className="text-sm text-neutral-text-muted transition hover:text-primary-light"
          >
            Esqueci a senha
          </a>
        </div>
        {error && <p className="mt-2 text-sm text-error">{error}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : `${submitLabel} →`}
        </Button>
      </div>

      <DividerText text="ou entre com outras contas" />
      <SocialLoginButtons />
    </form>
  );
}
