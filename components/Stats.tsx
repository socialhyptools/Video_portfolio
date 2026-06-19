'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Stat { value: string; label: string }

export default function Stats({ stats }: { stats: Stat[] }) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.stat-item')
    if (!items) return
    gsap.from(items, {
      opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
    })
  }, [])

  return (
    <section ref={containerRef} id="stats" className="px-6 md:px-12 py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="stat-item text-center px-6 py-8"
            style={{ borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
          >
            <div
              className="text-5xl font-bold leading-none mb-2"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--accent)' }}
            >
              {s.value}
            </div>
            <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--gray-500)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
