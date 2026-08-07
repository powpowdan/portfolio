'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const sectionIds = ['home', 'about', 'projects', 'skills']

interface SectionContextType {
  activeSection: string
}

const SectionContext = createContext<SectionContextType>({ activeSection: 'home' })

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const visible: Record<string, boolean> = {}
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      visible[id] = false

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible[id] = entry.isIntersecting
          const topmost = sectionIds.find((sid) => visible[sid])
          if (topmost) setActiveSection(topmost)
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <SectionContext.Provider value={{ activeSection }}>
      {children}
    </SectionContext.Provider>
  )
}

export function useActiveSection() {
  return useContext(SectionContext)
}
