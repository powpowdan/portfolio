'use client'

import type { ShellLine } from './shellReducer'

interface OutputLineProps {
  line: ShellLine
}

export default function OutputLine({ line }: OutputLineProps) {
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
