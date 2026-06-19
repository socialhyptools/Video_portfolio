'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VideoCard from './VideoCard'
import VideoModal from './VideoModal'
import ReelsCarousel from './ReelsCarousel'
import type { Video } from '@/lib/types'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  id: string
  tag: string
  title: string
  subtitle: string
  videos: Video[]
  layout: 'reels' | 'youtube' | 'brand' | 'cinematic'
}

export default function VideoSection({ id, tag, title, subtitle, videos, layout }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [modal, setModal] = useState<{ videoId: string; portrait: boolean } | null>(null)

  useEffect(() => {
    gsap.from(headerRef.current, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%' } })
    const cards = gridRef.current?.children
    if (cards) {
      gsap.from(Array.from(cards), { opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } })
    }
  }, [])

  const openModal = (v: Video) => setModal({ videoId: v.videoId, portrait: !!v.portrait })

  const gridClass = {
    reels: 'grid grid-cols-2 md:grid-cols-4 gap-3',
    youtube: 'grid md:grid-cols-2 gap-3',
    brand: 'grid md:grid-cols-3 gap-3',
    cinematic: 'grid md:grid-cols-[2fr_1fr] gap-3',
  }[layout]

  return (
    <>
      <section
        ref={sectionRef}
        id={id}
        className="px-6 md:px-12 py-20"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          ref={headerRef}
          className="flex items-end justify-between pb-5 mb-8"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>{tag}</div>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--white)' }}>{title}</h2>
          </div>
          <span className="text-xs tracking-wider uppercase hidden md:block" style={{ color: 'var(--gray-500)' }}>{subtitle}</span>
        </div>

        <div ref={gridRef} className={layout === 'reels' ? '' : gridClass}>
          {layout === 'reels' && (
            <ReelsCarousel videos={videos} onOpen={openModal} />
          )}

          {layout === 'youtube' && (() => {
            const [featured, ...rest] = videos
            return (
              <>
                <div className="md:row-span-2" style={{ minHeight: 320 }}>
                  <div className="h-full" style={{ aspectRatio: undefined }}>
                    <div className="relative h-full overflow-hidden rounded-sm" style={{ background: 'var(--gray-100)', minHeight: 320 }}>
                      <VideoCard {...featured} onClick={() => openModal(featured)} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {rest.map(v => (
                    <div key={v.id} style={{ aspectRatio: '16/9' }}>
                      <VideoCard {...v} onClick={() => openModal(v)} />
                    </div>
                  ))}
                </div>
              </>
            )
          })()}

          {layout === 'brand' && videos.map(v => (
            <div key={v.id} style={{ aspectRatio: '16/9' }}>
              <VideoCard {...v} onClick={() => openModal(v)} />
            </div>
          ))}

          {layout === 'cinematic' && (() => {
            const [featured, ...rest] = videos
            return (
              <>
                <div style={{ aspectRatio: '16/9' }}>
                  <VideoCard {...featured} onClick={() => openModal(featured)} />
                </div>
                <div className="flex flex-col gap-3">
                  {rest.map(v => (
                    <div key={v.id} className="flex-1" style={{ aspectRatio: '16/9' }}>
                      <VideoCard {...v} onClick={() => openModal(v)} />
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      </section>

      {modal && (
        <VideoModal
          videoId={modal.videoId}
          portrait={modal.portrait}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
