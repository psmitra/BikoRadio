import { faCirclePlay } from '@fortawesome/free-regular-svg-icons'
import { faHouse, faMicrophone, faRadio, faUsers } from '@fortawesome/free-solid-svg-icons'
import { BikoMark, LumumbaLogo, SankaraLogo } from '../ui/BrandLogos'
import Icon from '../ui/Icon'
import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Discover', icon: faHouse },
  { to: '/live-shows', label: 'Live shows', icon: faMicrophone },
  { to: '/my-channels', label: 'My channels', icon: faRadio },
  { to: '/replays', label: 'Replays', icon: faCirclePlay },
  { to: '/membership', label: 'Membership', icon: faUsers },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-3" aria-label="Main">
      {nav.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold transition ${isActive ? 'btn-blue' : 'text-ink hover:bg-surface'}`
          }
        >
          <Icon icon={icon} size={18} /> {label}
        </NavLink>
      ))}
      <div className="mt-3 space-y-2 border-t border-line pt-3 text-sm font-bold">
        <a href="#" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-surface"><LumumbaLogo /> Lumumba</a>
        <a href="#" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-surface"><SankaraLogo /> Sankara Television</a>
      </div>
      <div className="relative mt-auto hidden px-3 pb-3 pt-[64px] md:block">
        <img
          src="/images/africa-map.svg"
          alt=""
          aria-hidden="true"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="pointer-events-none absolute left-3 top-0 w-40 select-none"
        />
        <div className="relative pl-12">
          <p className="text-sm font-bold uppercase leading-6 tracking-[0.18em] text-slate-600">
            Radio<br />People<br />Community<br />Change
          </p>
          <div className="mt-2 h-0.5 w-9 bg-gold" />
        </div>
        <p className="relative mt-4 text-sm font-bold italic leading-5 text-ink">“Different voices.<br />A stronger tomorrow.”</p>
        <p className="relative mt-2 text-sm font-bold text-muted">Biko Radio</p>
      </div>
    </nav>
  )
}

/** Three bars that morph into a cross (no icon swap). */
function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  const bar = 'absolute left-1/2 top-1/2 -ml-2.5 -mt-px h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ease-in-out'
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className="relative size-10 shrink-0 rounded-md transition hover:bg-surface md:hidden"
    >
      <span className={`${bar} ${open ? 'translate-y-0 rotate-45' : '-translate-y-[7px]'}`} />
      <span className={`${bar} ${open ? 'scale-x-0 opacity-0' : ''}`} />
      <span className={`${bar} ${open ? 'translate-y-0 -rotate-45' : 'translate-y-[7px]'}`} />
    </button>
  )
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden' // keep the page still behind the drawer
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-4">
        <div className="flex items-center gap-2">
          <Hamburger open={open} onClick={() => setOpen((o) => !o)} />
          <div className="flex items-center gap-2 text-xl font-bold">
            <BikoMark size={40} />
            <span><span className="text-[#14284b]">Biko</span> <span className="text-brand">Radio</span></span>
          </div>
        </div>
        <a href="#" className="text-sm font-medium text-ink hover:underline">Back to Lumumba</a>
      </header>

      {/* Mobile drawer: slides in from the left over a fading backdrop. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-x-0 bottom-0 top-16 z-30 bg-black/40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        id="mobile-menu"
        inert={!open}
        className={`fixed bottom-0 left-0 top-16 z-40 w-64 overflow-y-auto border-r border-line bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar onNavigate={close} />
      </aside>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-line bg-white md:block"><Sidebar /></aside>
        <main className="min-w-0 flex-1 p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
