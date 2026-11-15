import { faTowerBroadcast, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import CreateChannelForm from '../components/channel/CreateChannelForm'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { deleteChannel, endLive, goLive } from '../services/api'
import { useChannels } from '../services/store'

export default function MyChannels() {
  const [channels] = useChannels()
  const toast = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const remove = async (id: string, name: string) => {
    setConfirmId(null)
    try {
      await deleteChannel(id)
      toast.success({ title: 'Channel deleted', message: `“${name}” has been removed.` })
    } catch {
      toast.error({ title: 'Could not delete channel', message: 'Something went wrong. Please try again.' })
    }
  }

  const toggle = async (id: string, live: boolean) => {
    setBusyId(id)
    try {
      if (live) {
        await endLive()
        toast.success({ title: 'Broadcast ended' })
      } else {
        await goLive(id)
        toast.success({ title: "You're live!", message: 'Your microphone is connected.' })
      }
    } catch (e) {
      toast.error({ title: 'Could not go live', message: e instanceof Error ? e.message : 'Please try again.' })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My channels</h1>
        <Button variant="gold" onClick={() => setCreateOpen(true)}>Create channel</Button>
      </div>

      {channels.length === 0 ? (
        <Card className="text-center">
          <Icon icon={faTowerBroadcast} size={32} className="text-muted" />
          <p className="mt-3 font-bold">You have no channels yet</p>
          <p className="text-sm text-muted">Click “Create channel” to start your first radio channel.</p>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <li key={c.id}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold break-words">{c.name}</h2>
                  {c.live && <span className="shrink-0 rounded-md bg-live px-2 py-0.5 text-xs font-bold text-white">LIVE</span>}
                </div>
                <p className="text-sm text-muted">{c.category} · {c.language}</p>
                {c.description && <p className="mt-2 text-sm break-words">{c.description}</p>}
                <p className="mt-2 text-xs text-muted">Created {new Date(c.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}</p>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" variant={c.live ? 'danger' : 'primary'} disabled={busyId === c.id} onClick={() => toggle(c.id, c.live)}>
                    {c.live ? 'End broadcast' : 'Go live'}
                  </Button>
                  {confirmId === c.id ? (
                    <Button variant="red" onClick={() => remove(c.id, c.name)}>Confirm delete</Button>
                  ) : (
                    <Button variant="red" aria-label={`Delete ${c.name}`} onClick={() => setConfirmId(c.id)} icon={<Icon icon={faTrash} />} />
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal title="Create your radio channel" open={createOpen} onClose={() => setCreateOpen(false)}>
        <CreateChannelForm embedded onCreated={() => setCreateOpen(false)} />
      </Modal>
    </div>
  )
}
