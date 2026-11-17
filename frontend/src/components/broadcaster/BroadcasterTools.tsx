import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCalendarDays, faGear, faHeadphones, faMicrophone, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { endLive, goLive, scheduleShow } from '../../services/api'
import { useChannels, useSchedule } from '../../services/store'
import { formatWhen, isFuture, todayISO } from '../../utils/dates'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'
import MicTestModal from './MicTestModal'

function Tool({ icon, title, sub, primary, onClick, disabled }: { icon: IconDefinition; title: string; sub: string; primary?: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-md border px-4 py-2.5 text-left transition disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${primary ? 'btn-blue' : 'border-line bg-white hover:bg-surface'}`}
    >
      <Icon icon={icon} size={20} className={primary ? '' : 'text-ink'} />
      <span>
        <span className="block text-[15px] font-bold leading-tight">{title}</span>
        <span className={`block text-[13px] ${primary ? 'text-white/80' : 'text-muted'}`}>{sub}</span>
      </span>
    </button>
  )
}

const input = 'w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function BroadcasterTools() {
  const [channels] = useChannels()
  const [schedule] = useSchedule()
  const [micOpen, setMicOpen] = useState(false)
  const [schedOpen, setSchedOpen] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const [selected, setSelected] = useState('')
  const [sched, setSched] = useState({ title: '', date: '', time: '' })

  const liveChannel = channels.find((c) => c.live)
  const channelId = channels.some((c) => c.id === selected) ? selected : (channels[0]?.id ?? '')
  const upcoming = schedule.filter(isFuture).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))

  const toggleLive = async () => {
    if (liveChannel) {
      await endLive()
      toast.success({ title: 'Broadcast ended', message: `“${liveChannel.name}” is now offline.` })
      return
    }
    if (!channelId) {
      toast.error({ title: 'No channel yet', message: 'Create a channel first, then you can go live.' })
      return
    }
    setBusy(true)
    try {
      await goLive(channelId)
      toast.success({ title: "You're live!", message: 'Your microphone is connected.' })
    } catch (e) {
      toast.error({ title: 'Could not go live', message: e instanceof Error ? e.message : 'Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  const submitSchedule = async (e: FormEvent) => {
    e.preventDefault()
    if (!isFuture(sched)) {
      toast.error({ title: 'Invalid date or time', message: 'Pick a date and time in the future.' })
      return
    }
    try {
      const show = await scheduleShow(sched)
      setSched({ title: '', date: '', time: '' })
      setSchedOpen(false)
      toast.success({ title: 'Show scheduled', message: `“${show.title}” · ${formatWhen(show)}`, to: '/live-shows', linkLabel: 'View schedule' })
    } catch {
      toast.error({ title: 'Could not schedule show', message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2">
        <Icon icon={faGear} className="text-brand" size={22} />
        <h2 className="text-xl font-extrabold">Broadcaster tools</h2>
      </div>
      <p className="mt-1 mb-3 text-sm text-muted">Everything you need to go live.</p>

      {channels.length > 1 && !liveChannel && (
        <label className="mb-3 block text-sm font-bold">
          Broadcast as
          <select className={`${input} mt-1 font-normal`} value={channelId} onChange={(e) => setSelected(e.target.value)}>
            {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      )}

      <div className="flex flex-1 flex-col gap-2 [&>button]:flex-1">
        <Tool primary icon={faHeadphones} title="Open studio" sub="Enter your broadcast studio" onClick={() => setStudioOpen(true)} />
        <Tool icon={faMicrophone} title="Test microphone" sub="Check your audio setup" onClick={() => setMicOpen(true)} />
        <Tool icon={faCalendarDays} title="Schedule show" sub="Plan for a future date" onClick={() => setSchedOpen(true)} />
        <Tool
          primary
          icon={faTowerBroadcast}
          title={liveChannel ? 'End broadcast' : 'Go live'}
          sub={liveChannel ? `Live as ${liveChannel.name}` : 'Start broadcasting now'}
          onClick={toggleLive}
          disabled={busy}
        />
      </div>

      {liveChannel && (
        <p className="mt-3 text-sm" role="status" title="Listeners will hear you once the streaming backend is connected.">
          <span className="font-bold text-live">● You are live</span>
          <span className="text-muted"> — microphone connected</span>
        </p>
      )}
      {upcoming[0] && (
        <p className="mt-3 text-sm text-muted">
          Next: <strong className="text-ink">{upcoming[0].title}</strong> · {formatWhen(upcoming[0])}
          {upcoming.length > 1 && <> · <Link to="/live-shows" className="font-bold text-brand hover:underline">+{upcoming.length - 1} more</Link></>}
        </p>
      )}

      <MicTestModal open={micOpen} onClose={() => setMicOpen(false)} />

      <Modal title="Schedule show" open={schedOpen} onClose={() => setSchedOpen(false)}>
        <form onSubmit={submitSchedule} className="space-y-3">
          <input required maxLength={80} className={input} placeholder="Show title" value={sched.title} onChange={(e) => setSched({ ...sched, title: e.target.value })} aria-label="Show title" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="date" min={todayISO()} className={input} value={sched.date} onChange={(e) => setSched({ ...sched, date: e.target.value })} aria-label="Date" />
            <input required type="time" className={input} value={sched.time} onChange={(e) => setSched({ ...sched, time: e.target.value })} aria-label="Time" />
          </div>
          <Button type="submit" className="w-full">Schedule</Button>
        </form>
      </Modal>

      <Modal title="Broadcast studio" open={studioOpen} onClose={() => setStudioOpen(false)}>
        <p className="text-sm text-muted">The studio (mixer, playlist, caller screening) needs the streaming backend and will be built in a later phase.</p>
      </Modal>
    </Card>
  )
}
