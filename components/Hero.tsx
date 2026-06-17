'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ heroVideoId }: { heroVideoId: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })

    tl.fromTo(labelRef.current, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' })
      .fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3')
      .fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo(actionsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(visualRef.current, { opacity: 0, scale: 0.95, x: 40 }, { opacity: 1, scale: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.9')
      .fromTo(badgeRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2')

    gsap.to(visualRef.current, {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen grid md:grid-cols-2 items-center gap-12 px-6 md:px-12 pt-32 pb-16 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(232,213,163,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        <div
          ref={labelRef}
          className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: 'var(--accent)' }}
        >
          <span className="w-8 h-px" style={{ background: 'var(--accent)' }} />
          Creative video studio
        </div>

        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-playfair)', lineHeight: 1.05 }}
        >
          Stories that<br />
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>move people.</em>
        </h1>

        <p
          ref={descRef}
          className="text-base leading-relaxed mb-10 max-w-lg"
          style={{ color: 'var(--gray-600)' }}
        >
          From viral reels to cinematic brand films — we craft video content that stops the scroll, builds audiences, and drives real results.
        </p>

        <div ref={actionsRef} className="flex flex-wrap gap-4 items-center">
          <a
            href="#reels"
            className="text-xs font-bold tracking-widest uppercase px-7 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: 'var(--black)' }}
          >
            Explore our work
          </a>
          <a
            href="#contact"
            className="text-xs font-medium tracking-wider uppercase pb-px transition-colors duration-200"
            style={{ color: 'var(--gray-600)', borderBottom: '1px solid transparent' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--white)'; (e.target as HTMLElement).style.borderColor = 'var(--white)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--gray-600)'; (e.target as HTMLElement).style.borderColor = 'transparent' }}
          >
            Get in touch
          </a>
        </div>
      </div>

      <div ref={visualRef} className="relative z-10">
        <div
          className="relative overflow-hidden rounded-sm mx-auto"
          style={{ aspectRatio: '9/16', maxHeight: '75vh', background: 'var(--gray-100)', maxWidth: 360 }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&modestbranding=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full border-0"
            title="Hero reel"
          />
        </div>

        <div
          ref={badgeRef}
          className="absolute -bottom-4 -left-4 hidden md:block rounded-sm px-5 py-4 text-sm"
          style={{ background: 'var(--gray-100)', border: '1px solid var(--gray-300)' }}
        >
          <strong className="block text-2xl font-bold leading-none mb-1" style={{ color: 'var(--accent)' }}>200+</strong>
          Videos delivered
        </div>
      </div>
    </section>
  )
}
