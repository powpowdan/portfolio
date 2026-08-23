'use client'

import { useEffect, useState } from 'react'
import { UNINSTALL_LOG, DELETION_FINAL_LINE } from '../../../lib/terminal/content/deletion'

type Phase = 'log' | 'crt' | 'final'

const LOG_LINE_MS = 520
const CRT_MS = 900

export default function DeletionOverlay() {
  const [phase, setPhase] = useState<Phase>('log')
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (phase !== 'log') return
    if (visibleLines >= UNINSTALL_LOG.length) {
      const t = setTimeout(() => setPhase('crt'), LOG_LINE_MS * 1.5)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisibleLines((n) => n + 1), LOG_LINE_MS)
    return () => clearTimeout(t)
  }, [phase, visibleLines])

  useEffect(() => {
    if (phase !== 'crt') return
    const t = setTimeout(() => setPhase('final'), CRT_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'final') return
    const restart = () => {
      window.location.reload()
    }
    window.addEventListener('keydown', restart)
    window.addEventListener('pointerdown', restart)
    return () => {
      window.removeEventListener('keydown', restart)
      window.removeEventListener('pointerdown', restart)
    }
  }, [phase])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="deleting the construct"
    >
      <div
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{ opacity: phase === 'log' ? Math.min(0.9, 0.35 + visibleLines * 0.08) : 1 }}
      />

      {phase === 'log' && (
        <div className="relative font-mono text-xs sm:text-sm text-white/60 leading-loose text-left px-6">
          {UNINSTALL_LOG.slice(0, visibleLines).map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}

      {phase === 'crt' && <div className="absolute inset-0 bg-white crt-off" />}

      {phase === 'final' && (
        <div className="relative text-center px-6">
          <p className="font-mono text-sm sm:text-base text-white/70 tracking-wide">
            {DELETION_FINAL_LINE}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="inline-block w-[8px] h-[1.1em] bg-white/80 animate-blink" aria-hidden="true" />
          </div>
          <p className="mt-8 font-mono text-[10px] text-white/25">any key</p>
        </div>
      )}
    </div>
  )
}
