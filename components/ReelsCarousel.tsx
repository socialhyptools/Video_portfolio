'use client'
import { useRef, useState } from 'react'
import VideoCard from './VideoCard'
import type { Video } from '@/lib/types'

interface Props {
  videos: Video[]
  onOpen: (v: Video) => void
}

export default function ReelsCarousel({ videos, onOpen }: Props) {
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Duplicate enough times so the scroll loop is seamless
  const repeated = [...videos, ...videos, ...videos]

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-3"
        style={{
          width: 'max-content',
          animation: `reels-scroll 60s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {repeated.map((v, i) => (
          <div
            key={`${v.id}-${i}`}
            style={{
              width: 'calc((100vw - 96px - 3 * 12px) / 4)',
              minWidth: 180,
              maxWidth: 280,
              aspectRatio: '9/16',
              flexShrink: 0,
            }}
          >
            <VideoCard {...v} onClick={() => onOpen(v)} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes reels-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  )
}
