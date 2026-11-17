import { faCheck, faPause, faPlay, faShareNodes, faSpinner, faUserCheck, faUserPlus, faVolumeHigh, faVolumeLow, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'
import Icon from '../ui/Icon'
import { useEffect, useState } from 'react'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { getLiveShow } from '../../services/api'
import { useChannels, useFollowing } from '../../services/store'
import type { LiveShow } from '../../types'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'

export default function HeroPlayer() {
  const [show, setShow] = useState<LiveShow | null>(null)
  const [following, setFollowing] = useFollowing()
  const [channels] = useChannels()
  const liveChannel = channels.find((c) => c.live)
  const toast = useToast()
  const [copied, setCopied] = useState(false) // Share button briefly says "Copied"
  const [imgOk, setImgOk] = useState(true) // false -> fall back to the gradient look
  const player = useAudioPlayer(show?.streamUrl ?? '')
  const showName = liveChannel?.name ?? show?.title ?? 'this show'

  useEffect(() => {
    void getLiveShow().then(setShow)
  }, [])

  // Stream problems are reported as a toast instead of text under the player.
  useEffect(() => {
    if (player.error) toast.error({ title: 'Could not play the stream', message: player.error })
  }, [player.error, toast])

  const toggleFollow = () => {
    const next = !following
    setFollowing(next)
    if (next) toast.success({ title: 'Following', message: `You're now following “${showName}”.` })
    else toast.success({ title: 'Unfollowed', message: `You stopped following “${showName}”.` })
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Biko Radio', url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success({ title: 'Link copied', message: 'The page link is on your clipboard. Paste it anywhere to share.' })
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return // user closed the share sheet
      toast.error({ title: 'Could not share', message: 'Copy the link from the address bar instead.' })
    }
  }

  return (
    <div className="flex flex-col">
      <div className="relative min-h-64 flex-1 overflow-hidden rounded-lg bg-gradient-to-br from-ink via-[#1b2d5a] to-[#0b1226] sm:min-h-72 fit:min-h-40">
        {imgOk ? (
          <>
            <img src="/images/hero.jpg" alt="" onError={() => setImgOk(false)} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-black/55" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_70%_40%,#4f8cff_0,transparent_55%)]" />
        )}
        {(show?.isLive || liveChannel) && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-live px-3 py-1 text-xs font-bold tracking-wide text-white">
            <span className="size-2 animate-pulse rounded-full bg-white" /> LIVE
          </span>
        )}
        <div className="absolute right-6 top-8 hidden text-right text-3xl font-bold leading-tight text-white/80 sm:block">
          Biko Radio
          <br />
          <span className="text-[#6ea1ff]">ON AIR</span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-xs font-bold tracking-widest text-white/80">LIVE SHOW</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{liveChannel?.name ?? show?.title ?? 'Loading…'}</h1>
          <p className="text-sm italic text-white/80">{liveChannel ? liveChannel.description || 'You are broadcasting now.' : show?.tagline}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          className="px-6 py-3 text-base"
          onClick={player.toggle}
          disabled={!show || player.loading}
          icon={<Icon icon={player.loading ? faSpinner : player.playing ? faPause : faPlay} size={16} className={player.loading ? 'animate-spin' : ''} />}
        >
          {player.playing ? 'Pause' : 'Listen live'}
        </Button>

        <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted sm:flex-none">
          <Icon icon={player.volume === 0 ? faVolumeXmark : player.volume < 0.5 ? faVolumeLow : faVolumeHigh} size={18} className={player.volume === 0 ? 'text-live' : ''} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={player.volume}
            onChange={(e) => player.setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="w-full min-w-0 accent-brand sm:w-28"
          />
        </label>

        <div className="grid w-full grid-cols-2 gap-3 sm:ml-auto sm:flex sm:w-auto sm:gap-2">
          <Button variant="outline" onClick={toggleFollow} icon={<Icon icon={following ? faUserCheck : faUserPlus} className="text-brand" />}>
            {following ? 'Following' : 'Follow'}
          </Button>
          <Button variant="outline" onClick={share} icon={<Icon icon={copied ? faCheck : faShareNodes} className={copied ? 'text-emerald-600' : 'text-brand'} />}>
            {copied ? 'Copied' : 'Share'}
          </Button>
        </div>
      </div>
    </div>
  )
}
