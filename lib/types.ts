export interface Video {
  id: string
  videoId: string
  title: string
  subtitle: string
  portrait?: boolean
  featured?: boolean
}

export interface VideoData {
  reels: Video[]
  youtube: Video[]
  brand: Video[]
  cinematic: Video[]
  hero: { videoId: string }
  stats: { value: string; label: string }[]
}
