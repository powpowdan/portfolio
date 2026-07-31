'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const sectionIds = ['about', 'projects', 'skills']

interface SectionContextType {
  activeSection: string
}

const SectionContext = createContext<SectionContextType>({ activeSection: 'about' })

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
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
