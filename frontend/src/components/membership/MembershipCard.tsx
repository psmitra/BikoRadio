import { faArrowRight, faBell, faBookmark, faCrown, faMessage } from '@fortawesome/free-solid-svg-icons'
import Icon from '../ui/Icon'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const perks = [
  { icon: faMessage, label: 'Member chat' },
  { icon: faBell, label: 'Show reminders' },
  { icon: faBookmark, label: 'Saved replays' },
]

export default function MembershipCard() {
  return (
    <section className="flex flex-col rounded-lg border border-line border-t-[6px] border-t-gold bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon icon={faCrown} className="text-gold" size={22} />
        <h2 className="text-xl font-extrabold">Become a member</h2>
      </div>
      <p className="mt-1 mb-4 text-sm text-muted">Support independent voices and help keep Biko Radio on air.</p>
      <Link to="/membership">
        <Button variant="gold" className="w-full py-3">Join membership</Button>
      </Link>
      <ul className="my-4 flex flex-1 flex-col justify-evenly gap-3 text-sm">
        {perks.map(({ icon, label }) => (
          <li key={label} className="flex items-center gap-3"><Icon icon={icon} size={18} className="text-muted" />{label}</li>
        ))}
      </ul>
      <div className="border-t border-line pt-3">
        <Link to="/membership" className="group inline-flex items-center gap-1 text-sm font-bold text-brand transition-colors duration-300 hover:text-black">
          Manage membership <Icon icon={faArrowRight} size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
        </Link>
      </div>
    </section>
  )
}
