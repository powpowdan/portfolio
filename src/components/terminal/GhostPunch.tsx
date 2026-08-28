'use client'

import { useEffect, useRef, useState } from 'react'

const SCRAMBLE_DELAY_MS = 250
const SCRAMBLE_TICKS = 8
const SCRAMBLE_TICK_MS = 80
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#'
const EDGE_CHARS = 2

interface GhostPunchProps {
  text: string
  dying?: boolean
  onGone: () => void
}

export default function GhostPunch({ text, dying, onGone }: GhostPunchProps) {
  const [display, setDisplay] = useState(text)
  const goneRef = useRef(false)
  const onGoneRef = useRef(onGone)
  onGoneRef.current = onGone

  useEffect(() => {
    if (!dying) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let tick = 0

    const step = () => {
      if (cancelled) return
      tick += 1
      const keep = text.length - Math.ceil((text.length * tick) / SCRAMBLE_TICKS)
      if (keep <= 0) {
        setDisplay('')
        if (!goneRef.current) {
          goneRef.current = true
          onGoneRef.current()
        }
        return
      }
      const edge = Math.min(EDGE_CHARS, keep)
      setDisplay(
        text.slice(0, keep - edge) +
          Array.from(
            { length: edge },
            () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
          ).join(''),
      )
      timer = setTimeout(step, SCRAMBLE_TICK_MS)
    }

    timer = setTimeout(step, SCRAMBLE_DELAY_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [dying, text])

  return (
    <div className="font-mono text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-wrap break-words">
      {display}
    </div>
  )
}
