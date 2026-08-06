'use client'

import { useEffect, useRef } from 'react'

interface MatrixRainOverlayProps {
  onDismiss: () => void
}

export default function MatrixRainOverlay({ onDismiss }: MatrixRainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let lastDrop = 0
    const fontSize = 16
    let columns = 0
    let drops: number[] = []

    function resize() {
      if (!canvas || !ctx) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columns = Math.floor(canvas.width / fontSize)
      drops = Array(columns).fill(0).map(() => Math.random() * -50)
    }
    resize()
    window.addEventListener('resize', resize)

    const glyphs = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF'
    function draw(ts: number) {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00d4ff'
      ctx.font = `${fontSize}px monospace`
      if (ts - lastDrop > 60) {
        for (let i = 0; i < drops.length; i++) {
          const ch = glyphs.charAt(Math.floor(Math.random() * glyphs.length))
          ctx.fillText(ch, i * fontSize, drops[i] * fontSize)
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          }
          drops[i] += 1
        }
        lastDrop = ts
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black cursor-pointer"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="matrix rain easter egg"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-muted/60 tracking-widest uppercase pointer-events-none">
        knock knock · click to exit
      </p>
    </div>
  )
}
