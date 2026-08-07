'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useActiveSection } from './SectionContext'

const sections = [
  { id: 'home', label: 'terminal' },
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
]

export default function SectionNav() {
  const { activeSection } = useActiveSection()
  const reduceMotion = useReducedMotion()

  return (
    <>
      <motion.nav
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 0.8, ease: 'easeOut' }}
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden pb-safe pointer-events-none"
        aria-label="Section navigation"
      >
        <div className="pointer-events-auto mx-auto max-w-xs sm:max-w-sm px-4 pb-2">
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/70 backdrop-blur-md px-3">
            {sections.map(({ id, label }) => {
              const isActive = activeSection === id
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="tap-target flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 no-underline"
                >
                  <span
                    className={`text-[11px] font-mono uppercase tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-accent' : 'text-muted/70'
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`h-1 w-1 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-accent shadow-[0_0_6px_rgba(0,212,255,0.5)]'
                        : 'bg-transparent'
                    }`}
                  />
                </a>
              )
            })}
          </div>
        </div>
      </motion.nav>

      <motion.nav
        initial={reduceMotion ? false : { opacity: 0 }}
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
    </>
  )
}
