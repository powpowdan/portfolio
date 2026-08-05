import type { ReactNode } from 'react'

export type OverlayKind = 'breathe' | 'matrix' | 'signalBurst' | 'wick' | 'drive'

export interface BreatheOverlayProps {
  mode: 'calm' | 'fight'
}

export type OverlayProps = BreatheOverlayProps

export interface ActiveOverlay {
  kind: OverlayKind
  props?: OverlayProps
}

export interface TypingChunk {
  text: string
  className?: string
  delayMs?: number
  newline?: boolean
}

export type TypingStream = AsyncIterable<TypingChunk>

export type CommandOutput = ReactNode | TypingStream

export interface CommandContext {
  args: string[]
  raw: string
  history: string[]
  reduceMotion: boolean
  allCommands: readonly Command[]
  triggerOverlay: (overlay: ActiveOverlay) => void
  clearOverlay: () => void
  triggerGlitch: () => void
  scrollToSection: (id: string) => void
  clearScreen: () => void
}

export interface ManDoc {
  description: string
  aliases?: string[]
  args?: string
  lore?: string
}

export interface Command {
  name: string
  description: string
  aliases?: string[]
  keywords?: string[]
  hidden?: boolean
  man?: ManDoc
  run: (ctx: CommandContext) => CommandOutput | Promise<CommandOutput>
}

export interface ParsedInput {
  name: string
  args: string[]
  raw: string
}

export function parseInput(line: string): ParsedInput {
  const trimmed = line.trim()
  if (!trimmed) return { name: '', args: [], raw: '' }
  const tokens = trimmed.split(/\s+/)
  const [name, ...args] = tokens
  return { name, args, raw: trimmed.slice(name.length).trim() }
}
