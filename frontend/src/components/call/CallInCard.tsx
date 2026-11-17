import { faMicrophone, faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { approveCaller, joinQueue, leaveQueue } from '../../services/api'
import { useQueueStatus } from '../../services/store'
import type { QueueStatus } from '../../types'
import MicTestModal from '../broadcaster/MicTestModal'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import { useToast } from '../ui/Toast'

const statusText: Record<QueueStatus, string> = {
  idle: 'Host approval required before you go on air.',
  queued: "You're in the queue. Waiting for the host to approve you…",
  approved: 'Approved! The host will bring you on air shortly.',
  onAir: "You're on air.",
}

export default function CallInCard() {
  const toast = useToast()
  const [status] = useQueueStatus()
  const [busy, setBusy] = useState(false)
  const [micOpen, setMicOpen] = useState(false)

  // Demo only: a timer stands in for the host's approval until the backend exists.
  useEffect(() => {
    if (status !== 'queued') return
    const t = setTimeout(() => void approveCaller(), 4000)
    return () => clearTimeout(t)
  }, [status])

  // Tell the caller when the (simulated) host approves them.
  const prevStatus = useRef(status)
  useEffect(() => {
    if (prevStatus.current === 'queued' && status === 'approved') {
      toast.success({ title: "You've been approved!", message: 'The host will bring you on air shortly.' })
    }
    prevStatus.current = status
  }, [status, toast])

  const join = async () => {
    setBusy(true)
    try {
      await joinQueue()
      toast.success({ title: "You're in the queue", message: 'Waiting for the host to approve you.' })
    } catch {
      toast.error({ title: 'Could not join the queue', message: 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  const leave = async () => {
    setBusy(true)
    try {
      await leaveQueue()
      toast.success({ title: 'Left the queue', message: 'You can rejoin whenever you like.' })
    } catch {
      toast.error({ title: 'Could not leave the queue', message: 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  const inQueue = status !== 'idle'

  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2">
        <Icon icon={faPhone} className="text-brand" size={20} />
        <h2 className="text-xl font-extrabold">Call in to the show</h2>
      </div>
      <p className="mt-1 mb-4 text-sm text-muted fit:mb-3">Be part of the conversation. Share your thoughts, ask a question or add your voice.</p>
      <div className="flex flex-1 flex-col gap-2.5 [&>button]:flex-1">
        <Button onClick={join} disabled={busy || inQueue} icon={<Icon icon={faPhone} />}>
          {inQueue ? 'In call queue' : 'Join call queue'}
        </Button>
        <Button variant="outline" onClick={() => setMicOpen(true)} icon={<Icon icon={faMicrophone} />}>
          Test microphone
        </Button>
        <Button variant="danger" onClick={leave} disabled={busy || !inQueue} icon={<Icon icon={faRightFromBracket} />}>
          Leave queue
        </Button>
      </div>
      <p className="mt-3 text-sm text-muted fit:mt-2" role="status">{statusText[status]}</p>
      <MicTestModal open={micOpen} onClose={() => setMicOpen(false)} />
    </Card>
  )
}
