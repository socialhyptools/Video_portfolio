'use client'

interface Props {
  videoId: string
  title: string
  subtitle: string
  portrait?: boolean
  onClick: () => void
}

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <polygon points="4,2 14,8 4,14" fill="white" />
  </svg>
)

export default function VideoCard({ videoId, title, subtitle, onClick }: Props) {
  const isPlaceholder = videoId.startsWith('VIDEO_ID')
  const thumb = isPlaceholder
    ? null
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div
      className="relative overflow-hidden rounded-sm cursor-pointer group"
      style={{ background: 'var(--gray-100)' }}
      onClick={onClick}
      data-video={videoId}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onClick() }}
      aria-label={`Play ${title}`}
    >
      {thumb ? (
        <img
          src={thumb}
          alt={title}
          className="w-full h-full object-cover absolute inset-0"
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-end p-3"
          style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)' }}
        >
          <span className="text-xs" style={{ color: 'var(--gray-500)' }}>Add video ID</span>
        </div>
      )}

      <div
        className="absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300"
        style={{ background: 'rgba(0,0,0,0.35)' }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 opacity-80 group-hover:opacity-100 group-hover:scale-110"
          style={{ border: '1.5px solid rgba(255,255,255,0.7)' }}
        >
          <PlayIcon />
        </div>

        <div className="relative z-10">
          <div className="text-sm font-medium leading-snug mb-1" style={{ color: 'var(--white)' }}>{title}</div>
          <div className="text-xs tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</div>
        </div>
      </div>
    </div>
  )
}
