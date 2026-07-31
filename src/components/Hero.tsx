'use client'

import { motion } from 'framer-motion'
import TerminalText from './TerminalText'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-3xl mx-auto w-full"
      >
        <div className="border border-white/[0.06] rounded-xl p-5 sm:p-8 md:p-10 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.04]">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-mono text-muted">portfolio.sh</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <span className="text-muted font-mono text-sm sm:text-base mt-2 mr-3 select-none">
                $
              </span>
              <div className="flex-1">
                <TerminalText />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="text-base sm:text-lg text-muted font-mono leading-relaxed max-w-xl"
            >
              <span className="text-accent">senior</span> full-stack web developer
              <br />
              <span className="text-white/40">based in</span> Ottawa, ON
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.2, duration: 0.6 }}
              className="flex flex-wrap gap-x-4 gap-y-2 pt-2"
            >
              <a
                href="#about"
                className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
              >
                about
              </a>
              <span className="text-muted/30">/</span>
              <a
                href="#projects"
                className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
              >
                projects
              </a>
              <span className="text-muted/30">/</span>
              <a
                href="#skills"
                className="tap-target text-xs font-mono text-muted hover:text-accent transition-colors duration-200 tracking-wider uppercase"
              >
                skills
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
