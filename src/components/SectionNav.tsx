'use client'

import { motion } from 'framer-motion'
import { useActiveSection } from './SectionContext'

const sections = [
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
]

export default function SectionNav() {
  const { activeSection } = useActiveSection()

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 4.5, duration: 0.8, ease: 'easeOut' }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
    >
      <div className="flex flex-col items-center gap-6">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className="group flex items-center gap-3 no-underline"
          >
            <span
              className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeSection === id
                  ? 'bg-accent shadow-[0_0_6px_rgba(0,212,255,0.5)]'
                  : 'bg-white/10 group-hover:bg-white/30'
              }`}
            />
            <span
              className={`text-[11px] font-mono tracking-widest uppercase transition-all duration-300 ${
                activeSection === id
                  ? 'text-accent opacity-100'
                  : 'text-muted/50 opacity-60 group-hover:text-accent/60'
              }`}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </motion.nav>
  )
}
