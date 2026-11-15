import { useCallback, useEffect, useRef, useState } from 'react'

export type MicState = 'idle' | 'requesting' | 'listening' | 'denied' | 'unsupported'

/** Opens the microphone and exposes a 0..1 input level for a meter. */
export function useMicTest() {
  const [state, setState] = useState<MicState>('idle')
  const [level, setLevel] = useState(0)
  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number>(0)

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    void ctxRef.current?.close()
    ctxRef.current = null
    setLevel(0)
    setState('idle')
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unsupported')
      return
    }
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      ctxRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let peak = 0
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128))
        setLevel(Math.min(1, peak / 64))
        rafRef.current = requestAnimationFrame(tick)
      }
      tick()
      setState('listening')
    } catch {
      setState('denied')
    }
  }, [])

  useEffect(() => stop, [stop])

  return { state, level, start, stop }
}
