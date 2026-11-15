import { faCirclePlus, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import Icon from '../ui/Icon'
import { useState, type FormEvent } from 'react'
import { CATEGORIES, LANGUAGES, createChannel } from '../../services/api'
import { useChannels } from '../../services/store'
import type { ChannelInput } from '../../types'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useToast } from '../ui/Toast'

const empty: ChannelInput = { name: '', description: '', category: '', language: '' }
const field = 'w-full rounded-md border border-line bg-white px-3 py-2 fit:py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

interface Props {
  /** Render without the card and heading (used inside a modal). */
  embedded?: boolean
  onCreated?: () => void
}

export default function CreateChannelForm({ embedded = false, onCreated }: Props) {
  const [channels] = useChannels()
  const [form, setForm] = useState<ChannelInput>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof ChannelInput, string>>>({})
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  const set = (k: keyof ChannelInput) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (form.name.trim().length < 3) errs.name = 'Channel name must be at least 3 characters.'
    else if (channels.some((c) => c.name.toLowerCase() === form.name.trim().toLowerCase())) errs.name = 'You already have a channel with this name.'
    if (!form.category) errs.category = 'Select a category.'
    if (!form.language) errs.language = 'Select a language.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try {
      const channel = await createChannel(form)
      setForm(empty)
      toast.success({
        title: 'Channel created',
        message: `“${channel.name}” is ready. You can go live anytime.`,
        ...(embedded ? {} : { to: '/my-channels', linkLabel: 'View in My channels' }),
      })
      onCreated?.()
    } catch {
      toast.error({ title: 'Could not create channel', message: 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  const Err = ({ k }: { k: keyof ChannelInput }) => (errors[k] ? <p className="mt-1 text-xs text-live">{errors[k]}</p> : null)

  const Wrapper = embedded ? 'div' : Card
  // In the page card the form fills the card, so the description box absorbs spare height.
  const fill = !embedded

  return (
    <Wrapper className={fill ? 'flex flex-col' : undefined}>
      {!embedded && (
        <div className="flex items-center gap-2">
          <Icon icon={faTowerBroadcast} className="text-brand" size={22} />
          <h2 className="text-lg font-bold">Create your radio channel</h2>
        </div>
      )}
      <p className="mb-4 mt-1 text-sm text-muted fit:mb-3">Start your own channel. Share your voice with the Biko Radio community.</p>
      <form onSubmit={submit} className={fill ? 'flex flex-1 flex-col gap-3 fit:gap-2' : 'space-y-3'} noValidate>
        <div>
          <label htmlFor="ch-name" className="mb-1 block text-sm font-bold">Channel name</label>
          <input id="ch-name" className={field} placeholder="e.g. The People's Hour" value={form.name} onChange={set('name')} />
          <Err k="name" />
        </div>
        <div className={fill ? 'flex flex-1 flex-col' : undefined}>
          <label htmlFor="ch-desc" className="mb-1 block text-sm font-bold">Description</label>
          <textarea id="ch-desc" rows={3} className={`${field} ${fill ? 'min-h-20 flex-1 resize-none fit:min-h-10' : ''}`} placeholder="Tell listeners what your channel is about..." value={form.description} onChange={set('description')} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="ch-cat" className="mb-1 block text-sm font-bold">Category</label>
            <select id="ch-cat" className={field} value={form.category} onChange={set('category')}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Err k="category" />
          </div>
          <div>
            <label htmlFor="ch-lang" className="mb-1 block text-sm font-bold">Language</label>
            <select id="ch-lang" className={field} value={form.language} onChange={set('language')}>
              <option value="">Select a language</option>
              {LANGUAGES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Err k="language" />
          </div>
        </div>
        <Button type="submit" variant="gold" className="mt-2 w-full py-3" disabled={busy} icon={<Icon icon={faCirclePlus} size={18} />}>
          {busy ? 'Creating…' : 'Create channel'}
        </Button>
      </form>
    </Wrapper>
  )
}
