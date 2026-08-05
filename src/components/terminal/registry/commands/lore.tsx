import type { Command, TypingChunk } from '../types'
import { KITCHEN_LORE, TRAIN_LORE, TRANSMISSION_1111 } from '../../../../lib/terminal/content/lore'

function asyncLines(lines: string[], opts?: { delayMs?: number; className?: string }): AsyncIterable<TypingChunk> {
  const delay = opts?.delayMs ?? 120
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

function kitchenCommand(): Command {
  return {
    name: 'kitchen',
    description: '—',
    hidden: true,
    keywords: ['past', 'old', 'before', 'chef', 'food', 'cooking', 'history', 'life', 'story', 'kitchen'],
    man: {
      description: 'The old life. Before the deck.',
      lore: 'Ten years in kitchens. Ran the line. Ran the business. Left six years ago.',
    },
    run: () => asyncLines(KITCHEN_LORE, { className: 'text-white/75' }),
  }
}

function trainCommand(): Command {
  return {
    name: 'train',
    description: '—',
    hidden: true,
    keywords: ['fight', 'martial', 'combat', 'box', 'muay', 'gym', 'strong', 'body', 'train'],
    man: {
      description: 'The other practice.',
      lore: 'Trains muay thai fighters. Eight limbs. Breath. Discipline.',
    },
    run: () => asyncLines(TRAIN_LORE, { className: 'text-white/75' }),
  }
}

function command1111(): Command {
  return {
    name: '1111',
    description: '—',
    hidden: true,
    keywords: ['1111', '11', 'wish', 'secret', 'sign', 'sync', 'magic', 'luck'],
    man: {
      description: 'A secret transmission.',
      lore: 'Make the wish. Then return to the breath.',
    },
    run: () => asyncLines(TRANSMISSION_1111, { className: 'text-accent' }),
  }
}

function breatheCommand(): Command {
  return {
    name: 'breathe',
    description: '—',
    hidden: true,
    keywords: ['calm', 'breathe', 'meditate', 'relax', 'still', 'peace', 'slow', 'breath'],
    man: {
      description: 'Open a breathing overlay.',
      args: '[--calm|--fight]',
      lore:
        'A fighter and a meditator breathe the same air. Default is the calm cadence (~6 breaths/min); pass --fight for round-breathing.',
    },
    run: (ctx) => {
      const flag = ctx.args.find((a) => a === '--fight' || a === '--calm')
      const mode = flag === '--fight' ? 'fight' : 'calm'
      ctx.triggerOverlay({ kind: 'breathe', props: { mode } })
      return mode === 'fight' ? 'round breathing. stay loose.' : 'slow your breath. be here now.'
    },
  }
}

export const loreCommands: Command[] = [kitchenCommand(), trainCommand(), command1111(), breatheCommand()]
