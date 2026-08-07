'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TerminalShell from './terminal/TerminalShell'
import NameReveal from './terminal/effects/NameReveal'

export default function Hero() {
  const [nameDone, setNameDone] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)

  useEffect(() => {
    if (!nameDone) return
    const t = setTimeout(() => setShowTerminal(true), 800)
    return () => clearTimeout(t)
  }, [nameDone])

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-6 sm:px-8 pt-16 sm:pt-24">
      <h1 className="sr-only">Dan Brown — Full-Stack Developer</h1>
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <div className="space-y-4">
          <NameReveal onDone={() => setNameDone(true)} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: nameDone ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="text-base sm:text-lg text-muted font-mono leading-relaxed max-w-xl"
          >
            <span className="text-accent">true</span> full-stack web developer
            <br />
            <span className="text-white/40">based in</span> Ottawa, ON
          </motion.p>
        </div>

        {showTerminal && (
          <div className="glitch-in border border-white/[0.06] rounded-lg p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.04]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-[10px] font-mono text-muted chromatic-hover">
                dan@portfolio.sh: ~
              </span>
            </div>
            <TerminalShell />
          </div>
        )}
      </div>
    </section>
  )
}
