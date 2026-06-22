'use client'
import { useRef, useState } from 'react'
import type { Video } from '@/lib/types'

interface Props {
  videos: Video[]
}

const CARD_W = 210
const GAP = 12

const GRADIENTS = [
  'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
  'linear-gradient(135deg,#0f3460 0%,#1a1a2e 100%)',
  'linear-gradient(135deg,#1b1b2f 0%,#2c2c54 100%)',
  'linear-gradient(135deg,#162447 0%,#1f4068 100%)',
  'linear-gradient(135deg,#1c1c1c 0%,#2d2d2d 100%)',
  'linear-gradient(135deg,#2d1b69 0%,#11998e 100%)',
  'linear-gradient(135deg,#141e30 0%,#243b55 100%)',
]

function ThumbCard({ v, index, onClick }: { v: Video; index: number; onClick: () => void }) {
  const [failed, setFailed] = useState(false)
  const tried = useRef(0)
  const fallbacks = [
    `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${v.videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${v.videoId}/default.jpg`,
  ]

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (tried.current < fallbacks.length) {
      e.currentTarget.src = fallbacks[tried.current]
      tried.current++
    } else {
      setFailed(true)
    }
  }

  const bg = GRADIENTS[index % GRADIENTS.length]

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Play ${v.title}`}
      style={{
        width: CARD_W,
        aspectRatio: '9/16',
        flexShrink: 0,
        flexGrow: 0,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 8,
        cursor: 'pointer',
        background: bg,
      }}
      className="group"
    >
      {!failed && (
        <img
          src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
          alt={v.title}
          onError={handleError}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      )}

      {/* dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
      }} />

      {/* play button */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 opacity-75 group-hover:opacity-100 group-hover:scale-110"
        style={{ border: '1.5px solid rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.3)' }}
      >
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
          <polygon points="2,1 13,8 2,15" fill="white" />
        </svg>
      </div>

      {/* title */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{v.subtitle}</div>
      </div>
    </div>
  )
}

export default function ReelsCarousel({ videos }: Props) {
  const [paused, setPaused] = useState(false)
  const [modal, setModal] = useState<Video | null>(null)

  // Triple for seamless infinite loop
  const items = [...videos, ...videos, ...videos]
  // translateX distance = one full copy width
  const loopPx = videos.length * (CARD_W + GAP)
  const duration = videos.length * 2.8 // ~2.8s per card

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: GAP,
            width: 'max-content',
            willChange: 'transform',
            animation: `reels-marquee ${duration}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {items.map((v, i) => (
            <ThumbCard key={`${v.id}-${i}`} v={v} index={i} onClick={() => setModal(v)} />
          ))}
        </div>

        <style>{`
          @keyframes reels-marquee {
            from { transform: translateX(0px); }
            to   { transform: translateX(-${loopPx}px); }
          }
        `}</style>
      </div>

      {/* Modal */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setModal(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 'min(90vw, 390px)', aspectRatio: '9/16', position: 'relative', borderRadius: 10, overflow: 'hidden' }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${modal.videoId}?autoplay=1&rel=0`}
              allow="autoplay; fullscreen"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
            <button
              onClick={() => setModal(null)}
              style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 20, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
            >×</button>
          </div>
        </div>
      )}
    </>
  )
}
