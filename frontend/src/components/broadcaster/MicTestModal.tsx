import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'
import Icon from '../ui/Icon'
import { useEffect } from 'react'
import { useMicTest } from '../../hooks/useMicTest'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const messages: Record<string, string> = {
  idle: 'Press start and speak. The bar should move with your voice.',
  requesting: 'Waiting for microphone permission…',
  listening: 'Microphone is working. Speak to see the level.',
  denied: 'Microphone access was blocked. Allow it in your browser settings.',
  unsupported: 'This browser does not support microphone access (use HTTPS or localhost).',
}

export default function MicTestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, level, start, stop } = useMicTest()

  useEffect(() => {
    if (!open) stop()
  }, [open, stop])

  const listening = state === 'listening'
  return (
    <Modal title="Test microphone" open={open} onClose={onClose}>
      <p className="mb-4 text-sm text-muted">{messages[state]}</p>
      {/* The gradient is laid across the whole track and revealed from the left, so the colour at the
          tip of the bar goes from light (quiet) to dark (loud) as the volume rises. */}
      <div className="mb-5 h-3 overflow-hidden rounded-full bg-surface" role="meter" aria-label="Input level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(level * 100)}>
        <div
          className="h-full w-full transition-[clip-path] duration-75"
          style={{
            background: 'linear-gradient(90deg, #bfe6ff 0%, #4db3ff 35%, #0a63e6 70%, #06277a 100%)',
            clipPath: `inset(0 ${100 - Math.max(level, 0.02) * 100}% 0 0 round 9999px)`,
          }}
        />
      </div>
      <Button
        className="w-full"
        variant={listening ? 'danger' : 'primary'}
        icon={<Icon icon={listening ? faMicrophoneSlash : faMicrophone} />}
        onClick={listening ? stop : start}
        disabled={state === 'requesting'}
      >
        {listening ? 'Stop test' : 'Start test'}
      </Button>
    </Modal>
  )
}
