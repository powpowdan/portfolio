'use client'

import { useEffect, useState } from 'react'

interface DriveWashOverlayProps {
  onDismiss: () => void
}

export default function DriveWashOverlay({ onDismiss }: DriveWashOverlayProps) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const duration = 6000
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const wave = Math.sin(t * Math.PI)
      setOpacity(wave * 0.6)
      if (t < 1) raf = requestAnimationFrame(tick)
      else onDismiss()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDismiss])

  return (
    <div
      className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at 50% 60%, rgba(232, 36, 60, ${opacity}) 0%, rgba(0, 0, 0, 0) 60%)`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="a real human being"
    >
      <p
        className="font-mono text-base sm:text-xl text-white/80 tracking-widest uppercase"
        style={{ opacity: Math.max(0.2, opacity) }}
      >
        a real human being. and a real hero.
      </p>
    </div>
  )
}
