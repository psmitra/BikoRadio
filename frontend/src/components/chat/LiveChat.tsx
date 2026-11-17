import { faArrowDown, faComments } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { sendMessage } from '../../services/api'
import { useChat } from '../../services/store'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Icon from '../ui/Icon'

const NEAR_BOTTOM_PX = 48

export default function LiveChat() {
  const [messages] = useChat()
  const [text, setText] = useState('')
  const [atBottom, setAtBottom] = useState(true)
  const [unread, setUnread] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const atBottomRef = useRef(true)
  const seenCount = useRef(messages.length)

  const scrollToBottom = useCallback((smooth: boolean) => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  // Start at the newest message.
  useEffect(() => scrollToBottom(false), [scrollToBottom])

  // New messages: follow them if you're at the bottom (or wrote them); otherwise count them.
  useEffect(() => {
    const fresh = messages.slice(seenCount.current)
    seenCount.current = messages.length
    if (fresh.length === 0) return
    if (atBottomRef.current || fresh.some((m) => m.user === 'You')) scrollToBottom(true)
    else setUnread((n) => n + fresh.length)
  }, [messages, scrollToBottom])

  const onScroll = () => {
    const el = listRef.current
    if (!el) return
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
    atBottomRef.current = near
    setAtBottom(near)
    if (near) setUnread(0)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setText('')
    await sendMessage('You', t)
  }

  const showJump = !atBottom

  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2">
        <Icon icon={faComments} className="text-brand" size={22} />
        <h2 className="text-xl font-extrabold">Live chat</h2>
      </div>

      {/* The list is absolutely positioned so its content never changes the card's height:
          the wrapper sets the size (and stretches with the row), the list scrolls inside it. */}
      <div className="relative mt-3 min-h-44 flex-1">
        <div ref={listRef} onScroll={onScroll} className="absolute inset-0 space-y-2 overflow-y-auto rounded-md bg-surface p-3 text-sm" aria-live="polite">
          <p className="text-muted">A respectful space for open conversation. Different people. Shared humanity.</p>
          {messages.map((m) => (
            <p key={m.id}>
              <span className="font-bold text-brand">{m.user}</span> <span className="text-xs text-muted">{m.time}</span>
              <br />
              <span className="break-words">{m.text}</span>
            </p>
          ))}
        </div>

        {/* Slides up from the bottom edge when you've scrolled away from the newest messages. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <button
            type="button"
            onClick={() => {
              scrollToBottom(true)
              setUnread(0)
            }}
            aria-label={unread > 0 ? `Scroll to latest messages, ${unread} new` : 'Scroll to latest messages'}
            aria-hidden={!showJump}
            tabIndex={showJump ? 0 : -1}
            className={`btn-blue inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-bold shadow-lg transition-[opacity,translate] duration-300 ease-out ${
              showJump ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <Icon icon={faArrowDown} size={13} />
            {unread > 0 ? `${unread} new` : 'Latest'}
          </button>
        </div>
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
