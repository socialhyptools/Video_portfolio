'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  videoId: string | null
  portrait: boolean
  onClose: () => void
}

export default function VideoModal({ videoId, portrait, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (videoId) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      gsap.fromTo(innerRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' })
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [videoId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!videoId) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <div ref={innerRef} className={`w-full ${portrait ? 'max-w-sm' : 'max-w-4xl'}`}>
        <div className="flex justify-end mb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-sm flex items-center justify-center text-sm font-medium transition-colors duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'var(--white)' }}
            aria-label="Close video"
          >
            ✕
          </button>
        </div>
        <div
          className="overflow-hidden rounded-sm"
          style={{ aspectRatio: portrait ? '9/16' : '16/9', background: 'var(--black)' }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full border-0"
            title="Video player"
          />
        </div>
      </div>
    </div>
  )
}
