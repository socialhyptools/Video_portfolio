import { NextResponse } from 'next/server'
import { getVideos, saveVideos } from '@/lib/videos'
import type { VideoData } from '@/lib/types'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'socialhyp2024'

function checkAuth(req: Request) {
  const auth = req.headers.get('x-admin-password')
  return auth === ADMIN_PASSWORD
}

export async function GET() {
  const data = getVideos()
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body: VideoData = await req.json()
    saveVideos(body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
