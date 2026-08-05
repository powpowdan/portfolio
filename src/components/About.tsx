'use client'

import { motion } from 'framer-motion'
import ScrambleHeading from './terminal/effects/ScrambleHeading'

const focusAreas = [
  'Full-Stack',
  'DevOps',
  'Automation',
  'Infrastructure',
  'AI / LLMs',
  'Accessibility (WCAG)',
]

const meta = [
  { k: 'role', v: 'Full-Stack Developer' },
  { k: 'location', v: 'Ottawa, ON' },
  { k: 'clearance', v: 'Secret' },
  { k: 'stack', v: 'Linux · AI · Cloud' },
]

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-8 py-16 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto w-full"
      >
        <ScrambleHeading command="cat about.txt" />

        <div className="card p-6 sm:p-8 space-y-8">
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-muted">
            <p>
              <span className="text-accent font-mono">day</span>
              <span className="mx-2 text-white/20">—</span>
              Building large-scale web applications, automated workflows, system
              administration, server infrastructure, and reliable deployments
              for high-profile projects.
            </p>
            <p>
              <span className="text-accent font-mono">night</span>
              <span className="mx-2 text-white/20">—</span>
              Driven by passion and curiosity, powered by Linux and AI. Apps,
              servers, automations, and custom software for myself and the
              world.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs text-accent uppercase tracking-widest mb-3">
              {'// '}focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area, i) => (
                <motion.span
                  key={area}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="tech-badge"
                >
                  {area}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-6 border-t border-white/[0.04] font-mono text-sm">
            {meta.map(({ k, v }) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-accent">{k}</span>
                <span className="text-muted text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
