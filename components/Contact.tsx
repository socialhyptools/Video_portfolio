'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    gsap.from(leftRef.current, { opacity: 0, x: -30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })
    gsap.from(rightRef.current, { opacity: 0, x: 30, duration: 0.8, ease: 'power3.out', delay: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const body = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setStatus('sent'); form.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputStyle = {
    background: 'var(--gray-100)',
    border: '1px solid var(--gray-300)',
    color: 'var(--white)',
    padding: '0.75rem 1rem',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    borderRadius: '2px',
    outline: 'none',
    width: '100%',
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="px-6 md:px-12 py-24 grid md:grid-cols-2 gap-16 items-start"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div ref={leftRef}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>Get in touch</div>
        <h2 className="text-5xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          Let&apos;s create<br />something great.
        </h2>
        <p className="mb-8 leading-relaxed" style={{ color: 'var(--gray-600)', maxWidth: '40ch' }}>
          Whether it&apos;s a brand film, a viral campaign, or a YouTube series — we&apos;d love to hear about your project.
        </p>

        <div className="flex flex-col gap-2">
          {[
            { icon: '✉', label: 'socialhypofficial@gmail.com', href: 'mailto:socialhypofficial@gmail.com' },
            { icon: '📷', label: '@socialhypofficial', href: 'https://instagram.com/socialhypofficial' },
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

      <div ref={rightRef}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Your name', name: 'name', type: 'text', placeholder: 'Full name' },
            { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@company.com' },
          ].map(f => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--gray-500)' }}>{f.label}</label>
              <input name={f.name} type={f.type} placeholder={f.placeholder} required style={inputStyle} />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--gray-500)' }}>Project type</label>
            <select name="project" style={inputStyle}>
              <option value="">Select a category</option>
              {['Social Reels / Short-form', 'YouTube Video', 'Brand / Commercial', 'Cinematic / Short film', 'Other'].map(o => (
                <option key={o} style={{ background: 'var(--gray-100)' }}>{o}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--gray-500)' }}>Tell us about your project</label>
            <textarea
              name="message"
              placeholder="Brief description, timeline, budget range…"
              required
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
            className="self-start text-xs font-bold tracking-widest uppercase px-7 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--black)' }}
          >
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message sent ✓' : 'Send message'}
          </button>

          {status === 'error' && (
            <p className="text-sm" style={{ color: '#f87171' }}>Something went wrong. Please email us directly.</p>
          )}
        </form>
      </div>
    </section>
  )
}
