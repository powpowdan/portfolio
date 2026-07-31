'use client'

import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section className="px-6 sm:px-8 py-16 sm:py-24 border-t border-white/[0.04]">
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
              className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
            >
              email
            </a>
            <a
              href="https://github.com/powpowdan"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
            >
              github
            </a>
            <a
              href="#"
              className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
            >
              linkedin
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-3 text-muted/40">
            <span>© {new Date().getFullYear()} Dan Brown</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <a
              href="/resume.docx"
              className="tap-target text-muted/40 hover:text-accent transition-colors duration-200"
            >
              $ wget resume.docx
            </a>
          </div>
          <span className="text-muted/40">built with Next.js + Tailwind</span>
        </div>
      </motion.div>
    </section>
  )
}
