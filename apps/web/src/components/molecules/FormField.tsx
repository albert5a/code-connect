import Input from "../atoms/Input";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <label htmlFor={id} className="space-y-2 text-sm text-neutral-text">
      <span className="block text-sm font-medium text-neutral-text-muted">
        {label}
      </span>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
