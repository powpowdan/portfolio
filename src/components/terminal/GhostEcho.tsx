'use client'

import { useEffect, useRef, useState } from 'react'

const TYPE_MS = 45
const RETREAT_START_MS = 100
const RETREAT_DECEL_MS = 8
const RETREAT_FLOOR_MS = 15

interface GhostEchoProps {
  cmd: string
  cwd: string
  root?: boolean
  dying?: boolean
  onTyped: () => void
  onGone: () => void
}

export default function GhostEcho({ cmd, cwd, root, dying, onTyped, onGone }: GhostEchoProps) {
  const [typed, setTyped] = useState(0)
  const typedRef = useRef(0)
  typedRef.current = typed
  const typedDoneRef = useRef(false)
  const goneRef = useRef(false)
  const onTypedRef = useRef(onTyped)
  onTypedRef.current = onTyped
  const onGoneRef = useRef(onGone)
  onGoneRef.current = onGone

  useEffect(() => {
    if (dying || typed >= cmd.length) return
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) setTyped((t) => Math.min(t + 1, cmd.length))
    }, TYPE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [dying, typed, cmd.length])

  useEffect(() => {
    if (!dying && !typedDoneRef.current && cmd.length > 0 && typed >= cmd.length) {
      typedDoneRef.current = true
      onTypedRef.current()
    }
  }, [dying, typed, cmd.length])

  useEffect(() => {
    if (!dying) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let pos = typedRef.current
    let delay = RETREAT_START_MS

    const step = () => {
      if (cancelled) return
      if (pos <= 0) {
        if (!goneRef.current) {
          goneRef.current = true
          onGoneRef.current()
        }
        return
      }
      timer = setTimeout(() => {
        if (cancelled) return
        pos -= 1
        setTyped(pos)
        delay = Math.max(RETREAT_FLOOR_MS, delay - RETREAT_DECEL_MS)
        step()
      }, delay)
    }
    step()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [dying])

  const showCaret = dying || typed < cmd.length

  return (
    <div className="flex items-start font-mono text-sm sm:text-base">
      <span className={`${root ? 'text-accentRoot' : 'text-accent'} mr-2 select-none`}>
        {cwd}
        {root ? ' #' : ' $'}
        {'\u00A0'}
      </span>
      <span className="text-white/90 whitespace-pre-wrap break-words">
        {cmd.slice(0, typed)}
        {showCaret && (
          <span className="inline-block w-[6px] h-[1em] bg-accent ml-0.5 self-center align-middle animate-blink" />
        )}
      </span>
    </div>
  )
}
