import type { Command, TypingChunk } from '../types'
import { FILM_PAYLOADS } from '../../../../lib/terminal/content/films'

function asyncLines(lines: string[], opts?: { delayMs?: number; className?: string }): AsyncIterable<TypingChunk> {
  const delay = opts?.delayMs ?? 110
  const className = opts?.className
  return (async function* () {
    for (const line of lines) {
      if (line === '') {
        yield { text: '', newline: true, delayMs: delay / 2 }
        continue
      }
      yield { text: line, delayMs: delay, className, newline: true }
    }
  })()
}

function filmCommand(name: keyof typeof FILM_PAYLOADS, description: string, keywords: string[]): Command {
  return {
    name,
    description: '—',
    hidden: true,
    keywords,
    man: { description: `Homage to ${name}.` },
    run: (ctx) => {
      const payload = FILM_PAYLOADS[name]
      if (!ctx.reduceMotion && payload.motion === 'rain') {
        ctx.triggerOverlay({ kind: 'matrix' })
      } else if (!ctx.reduceMotion && payload.motion === 'desaturate') {
        ctx.triggerOverlay({ kind: 'wick' })
      } else if (!ctx.reduceMotion && payload.motion === 'wash') {
        ctx.triggerOverlay({ kind: 'drive' })
      } else if (payload.motion === 'countdown' && !ctx.reduceMotion) {
        return countdownStream(payload.flavor)
      }
      return asyncLines(payload.flavor, { className: 'text-white/80' })
    },
  }
}

async function* countdownStream(flavor: string[]): AsyncIterable<TypingChunk> {
  for (const line of flavor) {
    if (line === '') {
      yield { text: '', newline: true, delayMs: 60 }
      continue
    }
    yield { text: line, delayMs: 110, newline: true, className: 'text-white/80' }
  }
  yield { text: '', newline: true, delayMs: 200 }
  for (let n = 5; n > 0; n -= 1) {
    yield { text: `${n}...`, delayMs: 800, className: 'text-accent', newline: true }
  }
  yield { text: 'walk away.', delayMs: 600, className: 'text-muted/60' }
}

export const filmCommands: Command[] = [
  filmCommand('matrix', '—', ['fun', 'game', 'hack', 'matrix', 'code', 'cool', 'easter', 'rain', 'green']),
  filmCommand('fight', '—', ['fight', 'club', 'rules', 'soap']),
  filmCommand('samurai', '—', ['samurai', 'bushido', 'hagakure', 'warrior', 'way', 'sword']),
  filmCommand('heat', '—', ['heat', 'doctrine', 'attachment', 'thirty', 'seconds']),
  filmCommand('bat', '—', ['bat', 'batty', 'bladerunner', 'tears', 'rain', 'roy']),
  filmCommand('gladiator', '—', ['gladiator', 'maximus', 'elysium', 'notyet', 'rome', 'arena']),
  filmCommand('wick', '—', ['wick', 'john', 'excommunicado', 'table', 'assassin']),
  filmCommand('drive', '—', ['drive', 'scorpion', 'jacket', 'hero', 'human', 'real']),
]
