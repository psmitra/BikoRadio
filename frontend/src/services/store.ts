// Tiny localStorage-backed store so data survives a refresh and stays in sync across
// components and browser tabs. When the NestJS backend exists, the API functions in
// api.ts will fetch from the server and this store can become a cache (or be removed).
import { useCallback, useSyncExternalStore } from 'react'
import type { Channel, ChatMessage, QueueStatus, ScheduledShow } from '../types'

const listeners = new Set<() => void>()
const cache = new Map<string, { raw: string | null; value: unknown }>()

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Returns a stable reference until the stored value actually changes. */
export function getItem<T>(key: string, initial: T): T {
  const raw = readRaw(key)
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value as T
  let value = initial
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T
    } catch {
      /* corrupt value: keep the default */
    }
  }
  cache.set(key, { raw, value })
  return value
}

export function setItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage blocked or full: keep the value in memory for this session.
    cache.set(key, { raw: readRaw(key), value })
  }
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

export function useStored<T>(key: string, initial: T) {
  const value = useSyncExternalStore(subscribe, () => getItem(key, initial))
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getItem(key, initial)
      setItem(key, typeof next === 'function' ? (next as (p: T) => T)(prev) : next)
    },
    [key, initial],
  )
  return [value, set] as const
}

// ---- keys and defaults -------------------------------------------------------

export const KEYS = {
  channels: 'biko-radio:channels',
  schedule: 'biko-radio:schedule',
  queue: 'biko-radio:queue',
  following: 'biko-radio:following',
  chat: 'biko-radio:chat',
} as const

export const NO_CHANNELS: Channel[] = []
export const NO_SHOWS: ScheduledShow[] = []

export const SEED_MESSAGES: ChatMessage[] = [
  { id: 's1', user: 'Amina', text: 'Great topic today!', time: '10:02' },
  { id: 's2', user: 'Joseph', text: 'Hello from Nairobi 👋', time: '10:03' },
  { id: 's3', user: 'Grace', text: 'Can we talk about local youth radio next?', time: '10:05' },
]

export const useChannels = () => useStored(KEYS.channels, NO_CHANNELS)
export const useSchedule = () => useStored(KEYS.schedule, NO_SHOWS)
export const useQueueStatus = () => useStored<QueueStatus>(KEYS.queue, 'idle')
export const useFollowing = () => useStored(KEYS.following, false)
export const useChat = () => useStored(KEYS.chat, SEED_MESSAGES)

// A broadcast only lasts as long as the tab that holds the microphone, so a page
// load always starts with every channel offline.
const initial = getItem(KEYS.channels, NO_CHANNELS)
if (initial.some((c) => c.live)) setItem(KEYS.channels, initial.map((c) => ({ ...c, live: false })))
