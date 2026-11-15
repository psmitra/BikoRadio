import type { HTMLAttributes } from 'react'

export default function Card({ className = '', ...rest }: HTMLAttributes<HTMLElement>) {
  return <section {...rest} className={`rounded-lg border border-line bg-white p-5 shadow-sm ${className}`} />
}
