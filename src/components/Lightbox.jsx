import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Close, ZoomIn } from './Icons'

export default function Lightbox({ images, index, alt, onClose, onIndexChange }) {
  const closeRef = useRef(null)
  const touchX = useRef(null)
  const [zoomed, setZoomed] = useState(false)
  const count = images.length
  const current = Math.min(Math.max(0, index), count - 1)

  // Return focus to whatever opened the viewer
  useEffect(() => {
    const opener = document.activeElement
    return () => {
      if (opener && typeof opener.focus === 'function') opener.focus()
    }
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight' && count > 1) {
        setZoomed(false)
        onIndexChange((current + 1) % count)
      }
      if (event.key === 'ArrowLeft' && count > 1) {
        setZoomed(false)
        onIndexChange((current - 1 + count) % count)
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
      window.clearTimeout(timer)
    }
  }, [count, current, onClose, onIndexChange])

  // Preload neighbours so browsing feels instant
  useEffect(() => {
    if (count < 2) return
    ;[(current + 1) % count, (current - 1 + count) % count].forEach((i) => {
      const img = new Image()
      img.src = images[i]
    })
  }, [current, count, images])

  if (!count) return null

  const go = (next) => {
    setZoomed(false)
    onIndexChange((next + count) % count)
  }

  const onTouchStart = (event) => {
    touchX.current = event.touches[0].clientX
  }

  const onTouchEnd = (event) => {
    if (zoomed || touchX.current == null || count < 2) return
    const delta = event.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(delta) > 50) go(delta < 0 ? current + 1 : current - 1)
  }

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — image viewer`}
    >
      <button
        type="button"
        className="lightbox__scrim"
        onClick={onClose}
        aria-label="Close image viewer"
        tabIndex={-1}
      />

      <div className="lightbox__bar">
        <span className="lightbox__count">
          {String(current + 1).padStart(2, '0')} /{' '}
          {String(count).padStart(2, '0')}
        </span>
        <div className="lightbox__tools">
          <button
            type="button"
            className={`lightbox__tool ${zoomed ? 'is-active' : ''}`}
            onClick={() => setZoomed((value) => !value)}
            aria-pressed={zoomed}
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            <ZoomIn size={18} />
          </button>
          <button
            ref={closeRef}
            type="button"
            className="lightbox__tool lightbox__tool--close"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <Close size={20} />
          </button>
        </div>
      </div>

      <div
        className="lightbox__stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 ? (
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => go(current - 1)}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
        ) : null}

        <figure
          className={`lightbox__figure ${zoomed ? 'is-zoomed' : ''}`}
          onClick={() => setZoomed((value) => !value)}
        >
          <img
            key={current}
            src={images[current]}
            alt={`${alt} — view ${current + 1}`}
            className="lightbox__image"
            draggable="false"
          />
        </figure>

        {count > 1 ? (
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={() => go(current + 1)}
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        ) : null}
      </div>

      <p className="lightbox__hint">
        Click the image to {zoomed ? 'zoom out' : 'zoom in'} · Use arrow keys to
        browse · Escape to close
      </p>
    </div>,
    document.body,
  )
}