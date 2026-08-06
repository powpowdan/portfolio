'use client'

import { useEffect, useState } from 'react'

interface NameRevealProps {
  skip?: boolean
  onDone?: () => void
}

const TYPING_SPEED = 80
const DELETING_SPEED = 40
const PAUSE_AFTER_HELLO = 1200

type Phase = 'typing-hello' | 'pausing-hello' | 'deleting' | 'typing-name' | 'done'

const HELLO_WORLD = 'Hello World'
const NAME_PART = "Hello, I'm Dan"
const KEEP_PREFIX = 'Hello'

export default function NameReveal({ skip, onDone }: NameRevealProps) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<Phase>('typing-hello')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (skip) {
      setDisplayed(NAME_PART)
      setPhase('done')
      setDone(true)
      onDone?.()
      return
    }
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'typing-hello') {
      if (displayed.length < HELLO_WORLD.length) {
        timer = setTimeout(() => setDisplayed(HELLO_WORLD.slice(0, displayed.length + 1)), TYPING_SPEED)
      } else {
        timer = setTimeout(() => setPhase('pausing-hello'), PAUSE_AFTER_HELLO)
      }
    } else if (phase === 'pausing-hello') {
      timer = setTimeout(() => setPhase('deleting'), 200)
    } else if (phase === 'deleting') {
      if (displayed.length > KEEP_PREFIX.length) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETING_SPEED)
      } else {
        timer = setTimeout(() => setPhase('typing-name'), 200)
      }
    } else if (phase === 'typing-name') {
      if (displayed.length < NAME_PART.length) {
        timer = setTimeout(() => setDisplayed(NAME_PART.slice(0, displayed.length + 1)), TYPING_SPEED)
      } else {
        timer = setTimeout(() => {
          setPhase('done')
          setDone(true)
          onDone?.()
        }, 200)
      }
    }
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, displayed, skip])

  return (
    <div className="font-mono text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white/90 leading-tight">
      <span>{displayed}</span>
      <span className="inline-block w-[3px] h-[0.8em] bg-accent ml-1 self-center animate-blink" />
    </div>
  )
}
