import type { Command, TypingChunk } from '../types'
import { NOW_POOL } from '../../../../lib/terminal/content/now'
import { randomFortune } from '../../../../lib/terminal/content/fortunes'
import { pick } from '../../../../lib/terminal/random'

function asyncLines(lines: string[], className?: string): AsyncIterable<TypingChunk> {
  return (async function* () {
    for (const line of lines) {
      yield { text: line, className, delayMs: 80, newline: true }
    }
  })()
}

const WHOAMI_VARIANTS = [
  'guest (read-only)',
  'visitor — welcome',
  'stranger (make yourself at home)',
  'you. here. now.',
  'guest · no permissions · full access',
  'anon · lurking · welcome regardless',
  'guest · the construct sees you',
] as const

const PRACTICE_VARIANTS = [
  'chef · muay thai · code',
  'kitchen · ring · keyboard',
  'cook · fight · build',
] as const

const UPTIME_VARIANTS = [
  'still going forward',
  'breathing · still here',
  'attached to nothing, still running',
  'fall down seven, stand up eight',
] as const

const THEME_VARIANTS = [
  'lo-fi cyberpunk',
  'tears in rain',
  'be here now',
  'warm neon · cold steel',
] as const

function whoamiCommand(): Command {
  return {
    name: 'whoami',
    description: 'who are you',
    keywords: ['user', 'identity', 'me', 'guest'],
    man: { description: 'Print the current visitor identity.' },
    run: () => pick(WHOAMI_VARIANTS),
  }
}

function pwdCommand(): Command {
  return {
    name: 'pwd',
    description: 'where are you',
    keywords: ['path', 'dir', 'location', 'where'],
    man: { description: 'Print the current working directory.' },
    run: (ctx) => ctx.cwd,
  }
}

function neofetchCommand(): Command {
  return {
    name: 'neofetch',
    description: 'system info',
    aliases: ['fetch', 'sysinfo'],
    keywords: ['info', 'system', 'specs', 'about', 'computer', 'setup'],
    man: { description: 'Display system info in classic neofetch style.' },
    run: () => {
      const lines = [
        '       .-.       guest@portfolio.sh',
        '      /v v\\      -------------------',
        '     ( ._. )     os        linux (construct)',
        '      `~`~`      host      ottawa, on',
        '                 shell     portfolio.sh',
        '                 role      full-stack dev',
        `                 practice  ${pick(PRACTICE_VARIANTS)}`,
        `                 uptime    ${pick(UPTIME_VARIANTS)}`,
        `                 theme     ${pick(THEME_VARIANTS)}`,
      ]
      return asyncLines(lines)
    },
  }
}

function nowCommand(): Command {
  return {
    name: 'now',
    description: "what dan's into now",
    aliases: ['today', 'current'],
    keywords: ['today', 'current', 'doing', 'life', 'now', 'into'],
    man: { description: "Print what Dan is currently learning, building, training, listening to. Variants each run." },
    run: () => {
      const lines = NOW_POOL.map(({ k, vs }) => `  ${k.padEnd(11, ' ')}${pick(vs)}`)
      return asyncLines(lines, 'text-white/80')
    },
  }
}

function fortuneCommand(): Command {
  return {
    name: 'fortune',
    description: 'random transmission',
    aliases: ['quote', 'wisdom'],
    keywords: ['fortune', 'quote', 'wisdom', 'words', 'say', 'random', 'advice'],
    man: { description: 'Print a random curated line from the fortune pool.' },
    run: () => {
      const f = randomFortune()
      const lines = pick([
        [`"${f.text}"`, `— ${f.attribution}`],
        [`${f.text}`, `// ${f.attribution}`],
        [`${f.text}`, `— ${f.attribution}`],
      ])
      return asyncLines(lines, 'text-white/75')
    },
  }
}

export const infoCommands: Command[] = [
  whoamiCommand(),
  pwdCommand(),
  neofetchCommand(),
  nowCommand(),
  fortuneCommand(),
]
