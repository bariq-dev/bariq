import { useState } from 'react'
import { buildInstagramLink } from '../data/site'
import { copyText } from '../services/clipboard'
import { Instagram } from './Icons'

export default function OrderButton({
  message = '',
  label = 'Order on Instagram',
  copiedLabel = 'Copied — opening Instagram',
  className = 'btn btn--dark',
  iconSize = 17,
}) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    // 1. Copy FIRST, synchronously inside the click, while the page has focus
    const ok = message ? copyText(message) : false

    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2600)
    }

    // 2. Then open Instagram
    window.open(buildInstagramLink(), '_blank', 'noopener,noreferrer')
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      <Instagram size={iconSize} />
      {copied ? copiedLabel : label}
    </button>
  )
}