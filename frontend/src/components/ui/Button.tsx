import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'danger' | 'gold' | 'red'

const styles: Record<Variant, string> = {
  primary: 'btn-blue',
  outline: 'bg-white text-ink hover:bg-surface border-line',
  danger: 'bg-white text-live hover:bg-red-50 border-live/60',
  red: 'bg-live text-white border-live hover:bg-[#c92721] hover:border-[#c92721]',
  gold:'bg-gold text-ink hover:bg-gold-dark border-gold',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

export default function Button({ variant = 'primary', icon, className = '', children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[15px] font-bold transition disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${styles[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}
