import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

type Kind = 'success' | 'error'

interface ToastInput {
  title: string
  message?: string
  /** optional link shown inside the toast */
  to?: string
  linkLabel?: string
}

interface ToastItem extends ToastInput {
  id: number
  kind: Kind
  /** true while the slide-out animation plays */
  leaving?: boolean
}

interface ToastApi {
  success: (t: ToastInput) => void
  error: (t: ToastInput) => void
}

const DURATION: Record<Kind, number> = { success: 5000, error: 7000 }
const EXIT_MS = 450 // keep in sync with .toast-out in index.css
const COLORS: Record<Kind, string> = { success: '#10b981', error: '#ef4444' }

const ToastContext = createContext<ToastApi>({ success: () => {}, error: () => {} })
export const useToast = () => useContext(ToastContext)

let nextId = 1

/** Circle draws itself, fills, then the tick / cross is drawn on top. */
function AnimatedMark({ kind }: { kind: Kind }) {
  const color = COLORS[kind]
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className="shrink-0 overflow-visible">
      <circle cx="22" cy="22" r="18" fill={color} className="toast-ring" />
      <circle cx="22" cy="22" r="18" fill={color} className="toast-fill" />
      <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" pathLength="1" className="toast-draw-circle" transform="rotate(-90 22 22)" />
      {kind === 'success' ? (
        <path d="M13.5 22.5l6 6 11-12.5" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="toast-draw-mark" />
      ) : (
        <>
          <path d="M16 16l12 12" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" pathLength="1" className="toast-draw-mark" />
          <path d="M28 16l-12 12" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" pathLength="1" className="toast-draw-mark toast-draw-mark-2" />
        </>
      )}
    </svg>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  // Dismissing plays the slide-out animation first, then removes the toast.
  const dismiss = useCallback((id: number) => {
    setItems((l) => (l.some((t) => t.id === id && !t.leaving) ? l.map((t) => (t.id === id ? { ...t, leaving: true } : t)) : l))
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), EXIT_MS)
  }, [])
  const push = useCallback(
    (kind: Kind, t: ToastInput) => {
      const id = nextId++
      setItems((l) => [...l, { ...t, id, kind }])
      setTimeout(() => dismiss(id), DURATION[kind])
    },
    [dismiss],
  )

  // Show at most three toasts: the oldest ones slide out to make room.
  useEffect(() => {
    const active = items.filter((t) => !t.leaving)
    if (active.length > 3) active.slice(0, active.length - 3).forEach((t) => dismiss(t.id))
  }, [items, dismiss])
  const api = useMemo<ToastApi>(() => ({ success: (t) => push('success', t), error: (t) => push('error', t) }), [push])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={`relative overflow-hidden rounded-2xl bg-white p-4 pr-10 shadow-2xl ring-1 ring-black/5 ${
              t.leaving ? 'toast-out pointer-events-none' : `pointer-events-auto ${t.kind === 'error' ? 'toast-shake' : 'toast-in'}`
            }`}
          >
            <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: COLORS[t.kind] }} />
            <div className="flex items-center gap-3 pl-1.5">
              <AnimatedMark kind={t.kind} />
              <div className="min-w-0">
                <p className="font-bold leading-tight">{t.title}</p>
                {t.message && <p className="mt-0.5 break-words text-sm text-muted">{t.message}</p>}
                {t.to && (
                  <Link
                    to={t.to}
                    onClick={() => dismiss(t.id)}
                    className="mt-2 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-bold text-brand transition hover:bg-brand/20"
                  >
                    {t.linkLabel ?? 'View'} →
                  </Link>
                )}
              </div>
            </div>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="absolute right-2 top-2 rounded-full p-1.5 text-muted hover:bg-surface">
              <Icon icon={faXmark} size={14} />
            </button>
            <span className="toast-bar absolute bottom-0 left-0 h-1" style={{ background: COLORS[t.kind], animationDuration: `${DURATION[t.kind]}ms` }} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
