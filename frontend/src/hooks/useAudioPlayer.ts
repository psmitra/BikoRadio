import { useCallback, useEffect, useRef, useState } from 'react'

const VOLUME_KEY = 'biko-radio:volume'

function loadVolume(): number {
  try {
    const v = parseFloat(localStorage.getItem(VOLUME_KEY) ?? '')
    if (Number.isFinite(v)) return Math.min(1, Math.max(0, v))
  } catch {
    /* storage unavailable */
  }
  return 0.6
}

export function useAudioPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [volume, setVolumeState] = useState(loadVolume)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audio.volume = loadVolume()
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
      audio.src = '' // drop the live stream buffer
      setPlaying(false)
      return
    }
    setError(null)
    setLoading(true)
    try {
      audio.src = src
      await audio.play()
      setPlaying(true)
    } catch {
      setError('Unable to play the stream right now.')
      setPlaying(false)
    } finally {
      setLoading(false)
    }
  }, [src])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    if (audioRef.current) audioRef.current.volume = v
    try {
      localStorage.setItem(VOLUME_KEY, String(v))
    } catch {
      /* storage unavailable */
    }
  }, [])

  return { playing, loading, error, volume, toggle, setVolume }
}
