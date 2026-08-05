'use client'

import { useEffect } from 'react'

interface WickDesatOverlayProps {
  onDismiss: () => void
}

export default function WickDesatOverlay({ onDismiss }: WickDesatOverlayProps) {
  useEffect(() => {
    document.documentElement.classList.add('filter', 'grayscale')
    const t = setTimeout(onDismiss, 4000)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('filter', 'grayscale')
    }
  }, [onDismiss])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center cursor-pointer"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="excommunicado effect"
    >
      <p className="font-mono text-xl sm:text-3xl text-red-500/80 tracking-widest uppercase">
        excommunicado
      </p>
    </div>
  )
}
