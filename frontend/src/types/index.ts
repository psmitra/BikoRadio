export type QueueStatus = 'idle' | 'queued' | 'approved' | 'onAir'

export interface LiveShow {
  id: string
  title: string
  tagline: string
  streamUrl: string
  isLive: boolean
}

export interface ChatMessage {
  id: string
  user: string
  text: string
  time: string
}

export interface ChannelInput {
  name: string
  description: string
  category: string
  language: string
}

export interface Channel extends ChannelInput {
  id: string
  createdAt: string
  live: boolean
}

export interface ScheduledShow extends ScheduleInput {
  id: string
}

export interface ScheduleInput {
  title: string
  date: string
  time: string
}
