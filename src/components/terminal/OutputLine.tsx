'use client'

import type { ShellLine } from './shellReducer'
import GhostEcho from './GhostEcho'
import GhostPunch from './GhostPunch'

interface OutputLineProps {
  line: ShellLine
  onGhostTyped?: (line: ShellLine) => void
  onGhostReap?: (id: string) => void
}

export default function OutputLine({ line, onGhostTyped, onGhostReap }: OutputLineProps) {
  if (line.ghost?.role === 'echo') {
    return (
      <GhostEcho
        cmd={line.ghost.cmd ?? ''}
        cwd={line.cwd ?? '~'}
        root={line.root}
        dying={line.ghost.dying}
        onTyped={() => onGhostTyped?.(line)}
        onGone={() => onGhostReap?.(line.id)}
      />
    )
  }

  if (line.ghost?.role === 'punch') {
    return (
      <GhostPunch
        text={line.text ?? ''}
        dying={line.ghost.dying}
        onGone={() => onGhostReap?.(line.id)}
      />
    )
  }

  if (line.kind === 'prompt') {
    return (
      <div className="flex items-start font-mono text-sm sm:text-base">
        <span className={`${line.root ? 'text-accentRoot' : 'text-accent'} mr-2 select-none`}>
          {line.cwd ?? '~'}{line.root ? ' #' : ' $'}{'\u00A0'}
        </span>
        <span className="text-white/90 whitespace-pre-wrap break-words">{line.text}</span>
      </div>
    )
  }

  if (line.kind === 'whisper') {
    return (
      <div className="font-mono text-xs text-muted/40 italic whitespace-pre-wrap break-words">
        {line.text}
      </div>
    )
  }

  if (line.kind === 'toast') {
    return (
      <div className="font-mono text-xs text-muted/40 italic whitespace-pre-wrap break-words">
        {line.text}
      </div>
    )
  }

  return (
    <div className="font-mono text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-wrap break-words">
      {line.node ?? line.text}
    </div>
  )
}
