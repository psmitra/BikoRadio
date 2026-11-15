/** Partner logos shown in the sidebar (inline SVG so they stay crisp). */

/** Biko Radio mark: studio microphone in a yoke with signal waves on both sides. */
export function BikoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="bikoBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2ab8ff" />
          <stop offset="1" stopColor="#0a63e6" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#bikoBlue)" strokeWidth="2.6" strokeLinecap="round">
        <path d="M11 15a11 11 0 0 0 0 12" />
        <path d="M5.5 11a18 18 0 0 0 0 20" />
        <path d="M37 15a11 11 0 0 1 0 12" />
        <path d="M42.5 11a18 18 0 0 1 0 20" />
        <path d="M15 22v1.5a9 9 0 0 0 18 0V22" />
        <path d="M24 33v8M16.5 43h15" />
      </g>
      <rect x="18" y="4" width="12" height="23" rx="6" fill="url(#bikoBlue)" />
      <g stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
        <path d="M18.5 10h11M18.5 14h11M18.5 18h11M18.5 22h11" />
        <path d="M24 4.5v22" />
      </g>
    </svg>
  )
}

export function LumumbaLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="2.5" width="21" height="19" rx="3" fill="#1d5fe0" stroke="#14213d" strokeWidth="1.5" />
      <path d="M9 7.5v9l7.5-4.5z" fill="#fff" />
      <path d="M17 1.5h6.5v6.5z" fill="#f5a623" />
    </svg>
  )
}

export function SankaraLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="africa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d5fe0" />
          <stop offset="0.55" stopColor="#1ea05a" />
          <stop offset="1" stopColor="#f5a623" />
        </linearGradient>
      </defs>
      <path
        d="M28 14 L42 8 L56 11 L70 12 L80 22 L93 38 L88 52 L79 56 L75 70 L67 85 L57 93 L49 88 L45 70 L36 60 L24 58 L12 50 L9 38 L17 30 L22 20 Z"
        fill="url(#africa)"
      />
    </svg>
  )
}
