'use client'

import { useEffect, useState } from 'react'
import type { TypingChunk } from './registry/types'

interface TypingProps {
  chunks: TypingChunk[]
  speed?: number
  onDone?: () => void
}

interface RenderedChunk {
  text: string
  className?: string
  newline?: boolean
}

export default function Typing({ chunks, speed = 30, onDone }: TypingProps) {
  const [done, setDone] = useState(false)
  const [rendered, setRendered] = useState<RenderedChunk[]>([])
  const [current, setCurrent] = useState<{ text: string; className?: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    async function consume() {
      for (const chunk of chunks) {
        if (cancelled) return
        await sleep(chunk.delayMs ?? 0)
        if (cancelled) return
        await typeChunk(chunk)
        if (cancelled) return
      }
      if (!cancelled) {
        setDone(true)
        onDone?.()
      }
    }

    function typeChunk(chunk: TypingChunk): Promise<void> {
      return new Promise((resolve) => {
        if (chunk.newline) {
          setRendered((prev) => [
            ...prev,
            { text: '', className: chunk.className, newline: true },
          ])
        }
        const text = chunk.text
        let i = 0
        setCurrent({ text: '', className: chunk.className })
        const step = () => {
          if (cancelled) return resolve()
          i += 1
          setCurrent({ text: text.slice(0, i), className: chunk.className })
          if (i < text.length) {
            timer = setTimeout(step, speed)
          } else {
            setRendered((prev) => [
              ...prev,
              { text, className: chunk.className },
            ])
            setCurrent(null)
            resolve()
          }
        }
        step()
      })
    }

    consume()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed])

  return (
    <span className={done ? '' : 'whitespace-pre-wrap'}>
      {rendered.map((c, i) =>
        c.newline ? (
          <br key={i} />
        ) : (
          <span key={i} className={`whitespace-pre-wrap ${c.className ?? ''}`}>
            {c.text}
          </span>
        ),
      )}
      {current && (
        <span className={`whitespace-pre-wrap ${current.className ?? ''}`}>
          {current.text}
          <span className="inline-block w-[6px] h-[1em] bg-accent ml-0.5 self-center align-middle animate-blink" />
        </span>
      )}
    </span>
  )
}

function sleep(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve()
  return new Promise((r) => setTimeout(r, ms))
}
