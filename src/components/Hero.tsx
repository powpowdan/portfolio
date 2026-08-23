'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TerminalShell from './terminal/TerminalShell'
import NameReveal from './terminal/effects/NameReveal'
import { isRoot, subscribe } from '../lib/terminal/discovery'

export default function Hero() {
  const [nameDone, setNameDone] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [rootMode, setRootMode] = useState(false)

  useEffect(() => subscribe(() => setRootMode(isRoot())), [])

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
          <div
            className={`glitch-in rounded-lg p-3 sm:p-4 bg-black/40 backdrop-blur-sm border transition-[border-color,box-shadow] duration-700 ${
              rootMode
                ? 'border-accentRoot/25 shadow-[0_0_50px_rgba(255,200,87,0.07)]'
                : 'border-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.04]">
              <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-700 ${rootMode ? 'bg-amber-200/70' : 'bg-red-500/80'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-700 ${rootMode ? 'bg-accentRoot/80' : 'bg-yellow-500/80'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-700 ${rootMode ? 'bg-amber-600/70' : 'bg-green-500/80'}`} />
              <span
                className={`ml-2 text-[10px] font-mono chromatic-hover transition-colors duration-700 ${
                  rootMode ? 'text-accentRoot/80' : 'text-muted'
                }`}
              >
                {rootMode ? 'root@portfolio.sh: ~' : 'dan@portfolio.sh: ~'}
              </span>
            </div>
            <TerminalShell />
          </div>
        )}
      </div>
    </section>
  )
}
