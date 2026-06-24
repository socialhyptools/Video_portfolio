'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.from(contentRef.current, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="px-6 md:px-12 py-24"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div ref={contentRef}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>Get in touch</div>
        <h2 className="text-5xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          Let&apos;s create<br />something great.
        </h2>
        <p className="mb-8 leading-relaxed" style={{ color: 'var(--gray-600)', maxWidth: '40ch' }}>
          Whether it&apos;s a brand film, a viral campaign, or a YouTube series — we&apos;d love to hear about your project.
        </p>

        <div className="flex flex-col gap-2" style={{ maxWidth: 420 }}>
          {[
            { icon: '✉', label: 'socialhypofficial@gmail.com', href: 'mailto:socialhypofficial@gmail.com' },
            { icon: '📷', label: 'info@socialhyp.com', href: 'mailto:info@socialhyp.com' },
            { icon: '▶', label: 'YouTube Channel', href: 'https://youtube.com/@socialhypofficial' },
          ].map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 text-sm transition-colors duration-200"
              style={{ color: 'var(--gray-600)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-600)')}
            >
              <span
                className="w-8 h-8 flex items-center justify-center rounded-sm flex-shrink-0 text-sm"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
              >{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
