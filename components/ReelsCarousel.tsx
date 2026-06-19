'use client'
import { useRef, useState } from 'react'
import VideoModal from './VideoModal'
import type { Video } from '@/lib/types'

interface Props {
  videos: Video[]
}

const CARD_WIDTH = 220
const GAP = 12

function Thumb({ videoId, title }: { videoId: string; title: string }) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
  const fallbacks = [
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`,
  ]
  const fallbackIdx = useRef(0)

  const handleError = () => {
    if (fallbackIdx.current < fallbacks.length) {
      setSrc(fallbacks[fallbackIdx.current])
      fallbackIdx.current++
    }
  }

  return (
    <img
      src={src}
      alt={title}
      onError={handleError}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
  )
}

export default function ReelsCarousel({ videos }: Props) {
  const [paused, setPaused] = useState(false)
  const [modal, setModal] = useState<Video | null>(null)

  // Triple the list so the seamless loop has enough content
  const items = [...videos, ...videos, ...videos]
  const trackWidth = videos.length * (CARD_WIDTH + GAP)

  return (
    <>
      <div
        className="relative w-full overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          style={{
            display: 'flex',
            gap: GAP,
            width: 'max-content',
            animation: `reels-marquee ${videos.length * 3}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {items.map((v, i) => (
            <div
              key={`${v.id}-${i}`}
              onClick={() => setModal(v)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setModal(v)}
              aria-label={`Play ${v.title}`}
              style={{
                width: CARD_WIDTH,
                aspectRatio: '9/16',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 6,
                cursor: 'pointer',
                background: '#111',
              }}
              className="group"
            >
              <Thumb videoId={v.videoId} title={v.title} />

              {/* overlay */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                }}
              />

              {/* play button */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
                style={{ border: '1.5px solid rgba(255,255,255,0.8)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polygon points="3,1 13,7 3,13" fill="white" />
                </svg>
              </div>

              {/* title */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-xs font-medium truncate" style={{ color: '#fff' }}>{v.title}</div>
                <div className="text-xs tracking-wider uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{v.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes reels-marquee {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(-${trackWidth}px); }
        }
      `}</style>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setModal(null)}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 400, aspectRatio: '9/16', position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
            <iframe
              src={`https://www.youtube.com/embed/${modal.videoId}?autoplay=1&rel=0`}
              allow="autoplay; fullscreen"
              className="w-full h-full"
              style={{ border: 'none' }}
            />
            <button
              onClick={() => setModal(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 18, lineHeight: 1 }}
            >×</button>
          </div>
        </div>
      )}
    </>
  )
}
