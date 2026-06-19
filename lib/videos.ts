import fs from 'fs'
import path from 'path'
import type { VideoData } from './types'

const dataPath = path.join(process.cwd(), 'data', 'videos.json')

export function getVideos(): VideoData {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as VideoData
}
