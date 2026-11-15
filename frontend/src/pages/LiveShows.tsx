import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'
import { useToast } from '../components/ui/Toast'
import { cancelScheduledShow } from '../services/api'
import { useChannels, useSchedule } from '../services/store'
import { formatWhen, isFuture } from '../utils/dates'

export default function LiveShows() {
  const [channels] = useChannels()
  const [schedule] = useSchedule()
  const toast = useToast()
  const live = channels.filter((c) => c.live)

  const cancel = async (id: string, title: string) => {
    try {
      await cancelScheduledShow(id)
      toast.success({ title: 'Show cancelled', message: `“${title}” has been removed from your schedule.` })
    } catch {
      toast.error({ title: 'Could not cancel show', message: 'Something went wrong. Please try again.' })
    }
  }
  const upcoming = schedule.filter(isFuture).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section>
        <h1 className="mb-3 text-2xl font-bold">Live now</h1>
        <ul className="space-y-3">
          <li>
            <Card className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">Community voices</p>
                <p className="text-sm text-muted">Real people. Real conversations. Stronger communities.</p>
              </div>
              <Link to="/"><Button>Listen</Button></Link>
            </Card>
          </li>
          {live.map((c) => (
            <li key={c.id}>
              <Card className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{c.name} <span className="ml-1 rounded-md bg-live px-2 py-0.5 text-xs text-white">YOU</span></p>
                  <p className="text-sm text-muted">{c.category} · {c.language}</p>
                </div>
                <Link to="/my-channels"><Button variant="outline">Manage</Button></Link>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Upcoming shows</h2>
        {upcoming.length === 0 ? (
          <Card className="text-center">
            <Icon icon={faCalendarDays} size={28} className="text-muted" />
            <p className="mt-3 font-bold">Nothing scheduled</p>
            <p className="text-sm text-muted">Use “Schedule show” in Broadcaster tools on the Discover page.</p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((s) => (
              <li key={s.id}>
                <Card className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold break-words">{s.title}</p>
                    <p className="text-sm text-muted">{formatWhen(s)}</p>
                  </div>
                  <Button variant="danger" onClick={() => cancel(s.id, s.title)}>Cancel</Button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
