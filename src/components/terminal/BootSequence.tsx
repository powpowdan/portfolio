'use client'

import { useEffect, useMemo, useState } from 'react'
import Typing from './Typing'
import { buildBootStream, rollBoot } from '../../lib/terminal/boot'
import { readFlag, writeFlag } from '../../lib/terminal/storage'
import { drainStream } from './utils'
import type { TypingChunk } from './registry/types'

interface BootSequenceProps {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const returning = useMemo(() => readFlag('bootSeen'), [])
  const rolls = useMemo(() => rollBoot(), [])
  const [chunks, setChunks] = useState<TypingChunk[] | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const full = buildBootStream(rolls)
    const accelerated = (async function* () {
      for await (const chunk of full) {
        yield { ...chunk, delayMs: returning ? 0 : chunk.delayMs }
      }
    })()
    drainStream(accelerated).then((drained) => {
      if (!cancelled) setChunks(drained)
    })
    return () => {
      cancelled = true
    }
  }, [rolls, returning])

  useEffect(() => {
    if (done) {
      writeFlag('bootSeen', true)
      onComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  if (!chunks) return null

  return (
    <div className="space-y-1.5">
      <Typing
        chunks={chunks}
        speed={returning ? 5 : 18}
        onDone={() => setDone(true)}
      />
    </div>
  )
}
