import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={`h-5 w-5 rounded-lg border border-slate-600 bg-slate-950 text-emerald-400 focus:ring-emerald-400 ${className}`}
    />
  )
}
