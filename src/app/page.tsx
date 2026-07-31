import { SectionProvider } from '@/components/SectionContext'
import SectionNav from '@/components/SectionNav'
import BackgroundEffects from '@/components/BackgroundEffects'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <SectionProvider>
      <BackgroundEffects />
      <SectionNav />
      <main className="relative z-10 min-h-screen">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </SectionProvider>
  )
}
