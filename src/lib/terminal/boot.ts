import type { TypingChunk } from '../../components/terminal/registry/types'
import { randomFortune } from './content/fortunes'
import { ROY_BATTY_MONOLOGUE } from './content/whispers'
import { pick } from './random'

const STATUS_LINES = [
  'construct loaded · here now',
  'deck online · breathe',
  'system ready · stay loose',
  'jacked in · attached to nothing',
  'construct loaded · lets go',
] as const

export interface BootRolls {
  is1111: boolean
  isBattyVariant: boolean
}

export function rollBoot(): BootRolls {
  return {
    is1111: Math.random() < 1 / 11,
    isBattyVariant: Math.random() < 1 / 50,
  }
}

function randomWeekday(): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[Math.floor(Math.random() * days.length)]
}

function randomMonth(): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[Math.floor(Math.random() * months.length)]
}

function randomTime(): string {
  const h = Math.floor(Math.random() * 24)
  const m = Math.floor(Math.random() * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function randomDay(): number {
  return 1 + Math.floor(Math.random() * 28)
}

export function buildBootStream(rolls: BootRolls): AsyncIterable<TypingChunk> {
  const rollsFinal = rolls ?? rollBoot()
  return (async function* () {
    const time = rollsFinal.is1111 ? '11:11' : randomTime()
    yield {
      text: `last login ${randomWeekday()} ${randomMonth()} ${randomDay()} ${time} on ttys001`,
      className: 'text-muted/70',
      delayMs: 400,
      newline: true,
    }

    if (rollsFinal.isBattyVariant) {
      yield {
        text: ROY_BATTY_MONOLOGUE,
        className: 'text-accent/80',
        delayMs: 600,
        newline: true,
      }
    } else {
      const f = randomFortune()
      yield {
        text: `motd: "${f.text}" — ${f.attribution}`,
        className: 'text-muted/70',
        delayMs: 500,
        newline: true,
      }
    }

    yield {
      text: 'initializing portfolio.sh ........... ok',
      className: 'text-white/70',
      delayMs: 600,
      newline: true,
    }
    yield {
      text: pick(STATUS_LINES),
      className: 'text-white/70',
      delayMs: 300,
      newline: true,
    }
    yield {
      text: '',
      delayMs: 200,
      newline: true,
    }
    yield {
      text: "type 'help' for commands",
      className: 'text-accent',
      delayMs: 400,
      newline: true,
    }
  })()
}
