import { faComments } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { sendMessage } from '../../services/api'
import { useChat } from '../../services/store'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Icon from '../ui/Icon'

export default function LiveChat() {
  const [messages] = useChat()
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setText('')
    await sendMessage('You', t)
  }

  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2">
        <Icon icon={faComments} className="text-brand" size={22} />
        <h2 className="text-xl font-extrabold">Live chat</h2>
      </div>
      <div ref={listRef} className="mt-3 min-h-44 flex-1 fit:min-h-20 space-y-2 overflow-y-auto rounded-md bg-surface p-3 text-sm" aria-live="polite">
        <p className="text-muted">A respectful space for open conversation. Different people. Shared humanity.</p>
        {messages.map((m) => (
          <p key={m.id}>
            <span className="font-bold text-brand">{m.user}</span> <span className="text-xs text-muted">{m.time}</span>
            <br />
            <span className="break-words">{m.text}</span>
          </p>
        ))}
      </div>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something…"
          aria-label="Chat message"
          maxLength={300}
          className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <Button type="submit" disabled={!text.trim()}>Send</Button>
      </form>
    </Card>
  )
}
