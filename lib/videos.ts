import fs from 'fs'
import path from 'path'
import type { VideoData } from './types'

const dataPath = path.join(process.cwd(), 'data', 'videos.json')

export function getVideos(): VideoData {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as VideoData
}

export function saveVideos(data: VideoData): void {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}
