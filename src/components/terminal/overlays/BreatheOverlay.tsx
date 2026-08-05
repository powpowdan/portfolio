'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface BreatheOverlayProps {
  mode: 'calm' | 'fight'
  onDismiss: () => void
}

interface Phase {
  name: string
  ms: number
  scale: number
}

const CALM_CYCLE: Phase[] = [
  { name: 'inhale', ms: 4000, scale: 1.6 },
  { name: 'hold', ms: 2000, scale: 1.6 },
  { name: 'exhale', ms: 6000, scale: 1 },
]

const FIGHT_CYCLE: Phase[] = [
  { name: 'sharp inhale', ms: 800, scale: 1.4 },
  { name: 'hold', ms: 400, scale: 1.4 },
  { name: 'release', ms: 1200, scale: 1 },
]

export default function BreatheOverlay({ mode, onDismiss }: BreatheOverlayProps) {
  const reduceMotion = useReducedMotion() ?? false
  const cycle = mode === 'fight' ? FIGHT_CYCLE : CALM_CYCLE
  const [phaseIdx, setPhaseIdx] = useState(0)
  const dismissedRef = useRef(false)

  useEffect(() => {
    dismissedRef.current = false
    return () => {
      dismissedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let i = phaseIdx
    let timer: ReturnType<typeof setTimeout>
    function tick() {
      if (dismissedRef.current) return
      i = (i + 1) % cycle.length
      setPhaseIdx(i)
      timer = setTimeout(tick, cycle[i].ms)
    }
    timer = setTimeout(tick, cycle[phaseIdx].ms)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  const phase = cycle[phaseIdx]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`breathing exercise, ${mode} mode`}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center cursor-pointer"
      onClick={onDismiss}
    >
      <div className="flex flex-col items-center gap-12">
        <div
          className="rounded-full bg-accent/20 border border-accent/40 transition-transform ease-in-out"
          style={{
            width: '40vmin',
            height: '40vmin',
            transform: reduceMotion ? 'scale(1.2)' : `scale(${phase.scale})`,
            transitionDuration: reduceMotion ? '0ms' : `${phase.ms}ms`,
            boxShadow: '0 0 80px rgba(0, 212, 255, 0.15)',
          }}
        />
        <div className="text-center">
          <p className="font-mono text-lg sm:text-2xl text-accent tracking-widest uppercase">
            {phase.name}
          </p>
          <p className="mt-3 font-mono text-xs text-muted/60 tracking-wider uppercase">
            {mode} · press any key to exit
          </p>
        </div>
      </div>
    </div>
  )
}
