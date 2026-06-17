'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

const links = [
  { href: '#reels', label: 'Reels' },
  { href: '#youtube', label: 'YouTube' },
  { href: '#brand', label: 'Brand' },
  { href: '#cinematic', label: 'Cinematic' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    )

    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(s => {
        if (window.scrollY >= (s as HTMLElement).offsetTop - 140) {
          setActive(s.id)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
      }}
    >
      <Link
        href="/"
        className="text-xl font-bold tracking-wide"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--accent)' }}
      >
        SocialHyp
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        {links.map(l => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
              style={{ color: active === l.href.slice(1) ? 'var(--white)' : 'var(--gray-600)' }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="hidden md:block text-xs tracking-wider uppercase transition-colors duration-200"
          style={{ color: 'var(--gray-500)' }}
        >
          Admin
        </Link>
        <a
          href="#contact"
          className="text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-sm transition-colors duration-200"
          style={{ background: 'var(--accent)', color: 'var(--black)' }}
        >
          Work with us
        </a>
      </div>
    </nav>
  )
}
