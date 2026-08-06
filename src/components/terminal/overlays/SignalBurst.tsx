'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface SignalBurstProps {
  onDone: () => void
}

export default function SignalBurst({ onDone }: SignalBurstProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 150)
    const t2 = setTimeout(onDone, 250)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  if (!visible) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[300] pointer-events-none"
      style={{
        background:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px),' +
          'repeating-linear-gradient(90deg, rgba(0,212,255,0.05) 0px, rgba(0,212,255,0.05) 2px, transparent 2px, transparent 5px),' +
          'linear-gradient(180deg, rgba(255,0,128,0.06) 0%, rgba(0,212,255,0.04) 50%, rgba(255,255,255,0.05) 100%)',
        mixBlendMode: 'screen',
        animation: 'signal-burst 150ms steps(4) forwards',
      }}
    >
      <div
        className="absolute inset-y-0"
        style={{
          left: '50%',
          width: '2px',
          background: 'rgba(255,255,255,0.6)',
          transform: 'translateX(-50%)',
        }}
      />
    </div>,
    document.body,
  )
}
