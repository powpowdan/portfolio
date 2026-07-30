'use client'

import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section className="px-6 sm:px-8 py-24 border-t border-white/[0.04]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto w-full"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-mono text-muted mb-1 tracking-widest uppercase">
              get in touch
            </p>
            <p className="font-mono text-sm text-white/60">
              daniel.brown.gov@gmail.com
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="mailto:daniel.brown.gov@gmail.com"
              className="text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
            >
              email
            </a>
            <a
              href="https://github.com/powpowdan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
            >
              github
            </a>
            <a
              href="#"
              className="text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
            >
              linkedin
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-muted/40">
          <span>© {new Date().getFullYear()} Dan Brown</span>
          <span className="hidden sm:inline">built with Next.js + Tailwind</span>
        </div>
      </motion.div>
    </section>
  )
}
