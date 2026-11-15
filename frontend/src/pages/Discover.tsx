import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import Icon from '../components/ui/Icon'
import BroadcasterTools from '../components/broadcaster/BroadcasterTools'
import CallInCard from '../components/call/CallInCard'
import CreateChannelForm from '../components/channel/CreateChannelForm'
import LiveChat from '../components/chat/LiveChat'
import MembershipCard from '../components/membership/MembershipCard'
import HeroPlayer from '../components/player/HeroPlayer'

// When the window is wide and tall enough (the "fit" variant in index.css) the whole page is
// exactly one screen tall and the cards share the height. Otherwise the page scrolls normally.
const cell =
  'flex flex-col [&>*]:flex-1 fit:min-h-0 fit:[&>*]:min-h-0 fit:[&>*]:overflow-y-auto fit:[&>section]:p-5fit:[&_button]:py-2'

export default function Discover() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12 fit:h-[max(calc(100dvh-7rem),51.5rem)] fit:grid-rows-[minmax(21.75rem,0.9fr)_minmax(25.5rem,1fr)_auto] fit:gap-4">
      {/* Below xl the order is: player, create channel, then the side cards (xl restores the 3-column design). */}
      <div className={`${cell} order-1 md:col-span-2 xl:order-none xl:col-span-6`}><HeroPlayer /></div>
      <div className={`${cell} order-3 xl:order-none xl:col-span-3`}><CallInCard /></div>
      <div className={`${cell} order-3 xl:order-none xl:col-span-3`}><MembershipCard /></div>

      <div className={`${cell} order-2 md:col-span-2 xl:order-none xl:col-span-6`}><CreateChannelForm /></div>
      <div className={`${cell} order-3 xl:order-none xl:col-span-3`}><BroadcasterTools /></div>
      <div className={`${cell} order-3 xl:order-none xl:col-span-3`}><LiveChat /></div>

      <div className="order-4 flex items-center gap-3 rounded-md border border-[#cfe0fb] bg-[#e8f1ff] px-4 py-3 text-sm fit:py-2 md:col-span-2 xl:order-none xl:col-span-12">
        <Icon icon={faCircleInfo} className="shrink-0 text-brand" size={20} />
        <p><strong>Screen callers before going on air.</strong> <span className="text-muted">Keep the conversation safe, respectful and on topic.</span></p>
        <span className="ml-auto hidden text-xs text-muted sm:block">
          <span className="font-bold text-[#14284b]">Biko</span> <span className="font-bold text-brand">Radio</span>{' '}
          <span className="font-extrabold text-gold">—</span> Radio for a more connected world.
        </span>
      </div>
    </div>
  )
}

