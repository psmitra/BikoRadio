import type { ScheduleInput } from '../types'

/** Local date as YYYY-MM-DD (for <input type="date" min>). */
export function todayISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function whenOf(s: Pick<ScheduleInput, 'date' | 'time'>): Date {
  return new Date(`${s.date}T${s.time}`)
}

export function isFuture(s: Pick<ScheduleInput, 'date' | 'time'>): boolean {
  const d = whenOf(s)
  return !Number.isNaN(d.getTime()) && d.getTime() > Date.now()
}

export function formatWhen(s: Pick<ScheduleInput, 'date' | 'time'>): string {
  return whenOf(s).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}
