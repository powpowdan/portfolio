import { SectionProvider } from '@/components/SectionContext'
import SectionNav from '@/components/SectionNav'
import BackgroundEffects from '@/components/BackgroundEffects'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import { getGitSha } from '@/lib/terminal/gitSha'

export default function Home() {
  const gitSha = getGitSha()
  return (
    <SectionProvider>
      <BackgroundEffects />
      <SectionNav />
      <main className="relative z-10 min-h-screen pb-28 lg:pb-0">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact gitSha={gitSha} />
      </main>
    </SectionProvider>
  )
}
