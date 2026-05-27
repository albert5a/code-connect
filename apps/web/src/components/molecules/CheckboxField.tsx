import Checkbox from "../atoms/Checkbox";

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function CheckboxField({
  label,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-neutral-text-muted">
      <Checkbox checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
