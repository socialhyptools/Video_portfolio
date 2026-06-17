'use client'
import { useEffect, useState, useCallback } from 'react'
import type { VideoData, Video } from '@/lib/types'

const SECTIONS: { key: keyof Omit<VideoData, 'hero' | 'stats'>; label: string }[] = [
  { key: 'reels', label: 'Social Reels' },
  { key: 'youtube', label: 'YouTube Videos' },
  { key: 'brand', label: 'Brand & Commercial' },
  { key: 'cinematic', label: 'Cinematic Films' },
]

const inputStyle = {
  background: '#1a1a1a',
  border: '1px solid #3a3a3a',
  color: '#f5f5f0',
  padding: '0.5rem 0.75rem',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
  borderRadius: '2px',
  outline: 'none',
  width: '100%',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState<VideoData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<typeof SECTIONS[number]['key']>('reels')
  const [heroId, setHeroId] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async (pw: string) => {
    const res = await fetch('/api/videos', { headers: { 'x-admin-password': pw } })
    if (!res.ok) { setError('Wrong password'); return }
    const json: VideoData = await res.json()
    setData(json)
    setHeroId(json.hero.videoId)
    setAuthed(true)
    setError('')
  }, [])

  const save = async () => {
    if (!data) return
    setSaving(true)
    const updated = { ...data, hero: { videoId: heroId } }
    await fetch('/api/videos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateVideo = (section: keyof Omit<VideoData, 'hero' | 'stats'>, idx: number, field: keyof Video, value: string | boolean) => {
    if (!data) return
    const updated = [...data[section]] as Video[]
    updated[idx] = { ...updated[idx], [field]: value }
    setData({ ...data, [section]: updated })
  }

  const addVideo = (section: keyof Omit<VideoData, 'hero' | 'stats'>) => {
    if (!data) return
    const newVideo: Video = {
      id: `${section}-${Date.now()}`,
      videoId: '',
      title: 'New Video',
      subtitle: 'Category',
      portrait: section === 'reels',
    }
    setData({ ...data, [section]: [...data[section], newVideo] })
  }

  const removeVideo = (section: keyof Omit<VideoData, 'hero' | 'stats'>, idx: number) => {
    if (!data) return
    const updated = [...data[section]]
    updated.splice(idx, 1)
    setData({ ...data, [section]: updated })
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="w-full max-w-sm p-8" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px' }}>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: '#e8d5a3' }}>Admin Panel</h1>
          <p className="text-sm mb-6" style={{ color: '#888' }}>SocialHyp · Video Manager</p>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') load(password) }}
              style={inputStyle}
            />
            {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}
            <button
              onClick={() => load(password)}
              className="text-xs font-bold tracking-widest uppercase py-2.5 rounded-sm"
              style={{ background: '#e8d5a3', color: '#0a0a0a' }}
            >
              Sign in
            </button>
          </div>
          <p className="text-xs mt-4" style={{ color: '#555' }}>Default password: <code style={{ color: '#888' }}>socialhyp2024</code></p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const activeVideos = data[tab] as Video[]

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#f5f5f0', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <span className="font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#e8d5a3', fontSize: '1.2rem' }}>SocialHyp</span>
          <span className="ml-3 text-xs tracking-widest uppercase" style={{ color: '#555' }}>Video Manager</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-xs tracking-wider uppercase" style={{ color: '#555' }}>← Portfolio</a>
          <button
            onClick={save}
            disabled={saving}
            className="text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-sm disabled:opacity-50"
            style={{ background: '#e8d5a3', color: '#0a0a0a' }}
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="px-8 py-8 max-w-5xl">
        {/* Hero video */}
        <div className="mb-10 p-6 rounded-sm" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#e8d5a3' }}>Hero Video</h2>
          <div className="flex gap-3 items-center">
            <input
              style={{ ...inputStyle, maxWidth: 320 }}
              value={heroId}
              onChange={e => setHeroId(e.target.value)}
              placeholder="YouTube Video ID"
            />
            {heroId && !heroId.startsWith('VIDEO_ID') && (
              <img src={`https://img.youtube.com/vi/${heroId}/mqdefault.jpg`} alt="thumb" style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 2 }} />
            )}
          </div>
          <p className="text-xs mt-2" style={{ color: '#555' }}>The video that autoplays in the hero section (muted loop).</p>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className="text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-sm transition-colors"
              style={{
                background: tab === s.key ? '#e8d5a3' : '#1a1a1a',
                color: tab === s.key ? '#0a0a0a' : '#888',
                border: '1px solid',
                borderColor: tab === s.key ? '#e8d5a3' : '#2a2a2a',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Video list */}
        <div className="flex flex-col gap-3">
          {activeVideos.map((v, i) => (
            <div key={v.id} className="p-5 rounded-sm admin-row" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center">
                {/* Thumbnail */}
                <div style={{ width: 80, height: 45, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                  {v.videoId && !v.videoId.startsWith('VIDEO_ID') && (
                    <img src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>

                {/* Video ID */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs tracking-wider uppercase" style={{ color: '#555' }}>YouTube ID</label>
                  <input
                    style={inputStyle}
                    value={v.videoId}
                    placeholder="e.g. dQw4w9WgXcQ"
                    onChange={e => updateVideo(tab, i, 'videoId', e.target.value)}
                  />
                </div>

                {/* Title & subtitle */}
                <div className="flex flex-col gap-2">
                  <input
                    style={inputStyle}
                    value={v.title}
                    placeholder="Video title"
                    onChange={e => updateVideo(tab, i, 'title', e.target.value)}
                  />
                  <input
                    style={{ ...inputStyle, fontSize: '0.75rem', color: '#888' }}
                    value={v.subtitle}
                    placeholder="Subtitle / category"
                    onChange={e => updateVideo(tab, i, 'subtitle', e.target.value)}
                  />
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeVideo(tab, i)}
                  className="text-xs px-3 py-2 rounded-sm transition-colors"
                  style={{ color: '#f87171', border: '1px solid #3a2020' }}
                  title="Remove video"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => addVideo(tab)}
            className="w-full py-3 text-xs font-semibold tracking-widest uppercase rounded-sm transition-colors"
            style={{ border: '1px dashed #3a3a3a', color: '#555' }}
          >
            + Add video
          </button>
        </div>

        {/* Stats editor */}
        <div className="mt-10 p-6 rounded-sm" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#e8d5a3' }}>Stats Bar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-2">
                <input
                  style={{ ...inputStyle, fontSize: '1.1rem', fontWeight: 700, color: '#e8d5a3' }}
                  value={s.value}
                  placeholder="Value"
                  onChange={e => {
                    const updated = [...data.stats]
                    updated[i] = { ...updated[i], value: e.target.value }
                    setData({ ...data, stats: updated })
                  }}
                />
                <input
                  style={{ ...inputStyle, fontSize: '0.75rem', color: '#888' }}
                  value={s.label}
                  placeholder="Label"
                  onChange={e => {
                    const updated = [...data.stats]
                    updated[i] = { ...updated[i], label: e.target.value }
                    setData({ ...data, stats: updated })
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
