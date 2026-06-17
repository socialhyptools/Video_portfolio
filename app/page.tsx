import { getVideos } from '@/lib/videos'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import VideoSection from '@/components/VideoSection'
import Contact from '@/components/Contact'
import Cursor from '@/components/Cursor'

export const dynamic = 'force-dynamic'

export default function Home() {
  const data = getVideos()

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero heroVideoId={data.hero.videoId} />
        <Stats stats={data.stats} />
        <VideoSection id="reels" tag="Category 01" title="Social Reels" subtitle="Short-form · Vertical · Viral" videos={data.reels} layout="reels" />
        <VideoSection id="youtube" tag="Category 02" title="YouTube Videos" subtitle="Long-form · Storytelling" videos={data.youtube} layout="youtube" />
        <VideoSection id="brand" tag="Category 03" title="Brand & Commercial" subtitle="Campaigns · Ads · Promo" videos={data.brand} layout="brand" />
        <VideoSection id="cinematic" tag="Category 04" title="Cinematic Films" subtitle="Narrative · Short films" videos={data.cinematic} layout="cinematic" />
        <Contact />
      </main>
      <footer className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 text-xs gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--gray-500)' }}>
        <span>© {new Date().getFullYear()} SocialHyp. All rights reserved.</span>
        <span>Made with craft &amp; precision.</span>
      </footer>
    </>
  )
}
