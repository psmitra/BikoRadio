// API layer. Today it reads/writes the browser store (services/store.ts).
// When the NestJS backend is ready, replace each body with fetch() calls and keep
// the signatures so no component has to change (see GUIDE.md "Step 5").
import type { Channel, ChannelInput, ChatMessage, LiveShow, QueueStatus, ScheduleInput, ScheduledShow } from '../types'
import { KEYS, NO_CHANNELS, NO_SHOWS, SEED_MESSAGES, getItem, setItem } from './store'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const CATEGORIES = ['Talk', 'Music', 'News', 'Culture', 'Sports', 'Education']
export const LANGUAGES = ['English', 'French', 'Swahili', 'Lingala', 'Arabic', 'Portuguese']

const channels = () => getItem(KEYS.channels, NO_CHANNELS)
const saveChannels = (list: Channel[]) => setItem(KEYS.channels, list)

// ---- shows -------------------------------------------------------------------

export async function getLiveShow(): Promise<LiveShow> {
  await delay(100)
  return {
    id: 'show-1',
    title: 'Community voices',
    tagline: 'Real people. Real conversations. Stronger communities.',
    // Demo stream; replace with your Icecast/HLS URL from the backend.
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    isLive: true,
  }
}

export async function scheduleShow(input: ScheduleInput): Promise<ScheduledShow> {
  await delay()
  const show: ScheduledShow = { ...input, title: input.title.trim(), id: crypto.randomUUID() }
  setItem(KEYS.schedule, [...getItem(KEYS.schedule, NO_SHOWS), show])
  return show
}

export async function cancelScheduledShow(id: string): Promise<void> {
  setItem(KEYS.schedule, getItem(KEYS.schedule, NO_SHOWS).filter((s) => s.id !== id))
}

// ---- channels ----------------------------------------------------------------

export async function createChannel(input: ChannelInput): Promise<Channel> {
  await delay()
  const channel: Channel = {
    ...input,
    name: input.name.trim(),
    description: input.description.trim(),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    live: false,
  }
  saveChannels([channel, ...channels()])
  return channel
}

export async function deleteChannel(id: string): Promise<void> {
  if (channels().find((c) => c.id === id)?.live) stopMic()
  saveChannels(channels().filter((c) => c.id !== id))
}

// ---- broadcasting ------------------------------------------------------------
// Going live opens the microphone. Sending the audio to listeners needs the backend
// (Icecast/WebRTC); until then the mic is only held open so the flow can be tested.

let micStream: MediaStream | null = null

function stopMic() {
  micStream?.getTracks().forEach((t) => t.stop())
  micStream = null
}

export async function goLive(channelId: string): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('This browser cannot access the microphone (use HTTPS or localhost).')
  }
  try {
    stopMic()
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    throw new Error('Microphone access was blocked. Allow it in your browser to go live.')
  }
  // Only one of your channels can be live at a time.
  saveChannels(channels().map((c) => ({ ...c, live: c.id === channelId })))
}

export async function endLive(): Promise<void> {
  stopMic()
  saveChannels(channels().map((c) => ({ ...c, live: false })))
}

// ---- call queue --------------------------------------------------------------

const setQueue = (s: QueueStatus) => setItem(KEYS.queue, s)

export async function joinQueue(): Promise<void> {
  await delay()
  setQueue('queued')
}

export async function approveCaller(): Promise<void> {
  // Backend: the host approves from the studio. Here a timer stands in for the host.
  if (getItem<QueueStatus>(KEYS.queue, 'idle') === 'queued') setQueue('approved')
}

export async function leaveQueue(): Promise<void> {
  setQueue('idle')
}

// ---- chat --------------------------------------------------------------------

const MAX_MESSAGES = 200

export async function sendMessage(user: string, text: string): Promise<ChatMessage> {
  const msg: ChatMessage = {
    id: crypto.randomUUID(),
    user,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
  setItem(KEYS.chat, [...getItem(KEYS.chat, SEED_MESSAGES), msg].slice(-MAX_MESSAGES))
  return msg
}
