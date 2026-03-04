import { Navbar } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Hero, Features, Cta } from '@/components/sections'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
