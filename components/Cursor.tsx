'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const enter = () => cursor.classList.add('hovering')
    const leave = () => cursor.classList.remove('hovering')

    window.addEventListener('mousemove', move)

    const hoverEls = document.querySelectorAll('a, button, [data-video]')
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor hidden md:block" aria-hidden="true" />
}
