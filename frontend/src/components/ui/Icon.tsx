import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  icon: IconDefinition
  /** font-size in px */
  size?: number
  className?: string
}

/** Thin wrapper so every icon in the app is a Font Awesome icon with a fixed-width box. */
export default function Icon({ icon, size = 16, className = '' }: Props) {
  return <FontAwesomeIcon icon={icon} fixedWidth className={className} style={{ fontSize: size }} />
}
