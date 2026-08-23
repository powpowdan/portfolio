import type { Command, CommandContext, TypingChunk } from '../types'
import { pick } from '../../../../lib/terminal/random'
import { cdSuccessVariant } from './discoverability'
import {
  VIRTUAL_DIRS,
  VIRTUAL_DIR_NAMES,
  isVirtualDir,
  parseVirtualPath,
  type VirtualDirName,
} from '../../../../lib/terminal/content/secret_files'

const SECTIONS = ['about', 'projects', 'skills', 'contact'] as const
type Section = (typeof SECTIONS)[number]

const SECTION_FILES: Record<Section, string> = {
  about: 'about.txt',
  projects: 'projects/',
  skills: 'skills.json',
  contact: 'contact.vcf',
}

const CAT_CONTENT: Record<Section, string> = {
  about: [
    'day   — large-scale web apps, automation, infrastructure.',
    '        running the public facing site and intranet end-to-end.',
    'night — linux, ai, automations, custom software for the world.',
    '        a growing homelab — proxmox, docker, pi-hole, jellyfin.',
    '',
    'focus: full-stack · mobile · local-first · linux & self-hosting · automation · ai tooling',
    '',
    'role       full-stack developer',
    'location   ottawa, on', 
    'stack      linux · ts · react · python',
  ].join('\n'),
  projects: [
    'the meditation app → simply meditation          react native · typescript · track player',
    'the global camera network → cam-spy             react 19 · leaflet · vite',
    'the class builder → cadence                     react 19 · vite 7 · supabase',
    'the workout tracker → atlas                     react native · expo · sqlite',
    '',
    '(use `cd projects` to view full cards)',
  ].join('\n'),
  skills: [
    'languages   ts · js · python · sql · bash',
    'frontend    react 19 · next.js · tailwind · bootstrap · vite',
    'mobile      react native · expo · eas',
    'backend     fastapi · supabase · postgres · sqlite · mongo · rest',
    'ops         linux · proxmox · docker · aws · git · vercel · power automate',
    'craft       ai-augmented dev · wcag 2.2 · jest · open data',
  ].join('\n'),
  contact: [
    'email     daniel.brown.gov@gmail.com',
    'github    powpowdan',
    '',
    '(use `email` or `github` for direct links)',
  ].join('\n'),
}

function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value)
}

function normalizeSection(input: string): Section | null {
  const lower = input.toLowerCase().replace(/\/+$/, '').trim()
  if (isSection(lower)) return lower
  for (const s of SECTIONS) {
    if (SECTION_FILES[s].replace(/\/+$/, '') === lower) return s
    if (lower.startsWith(s + '.')) return s
  }
  return null
}

function currentVirtualDir(cwd: string): VirtualDirName | null {
  if (cwd === '~' || !cwd.startsWith('~/')) return null
  const name = cwd.slice(2)
  return isVirtualDir(name) ? name : null
}

const DIR_HINTS = [
  '(cat a file to learn what it hides.)',
  '(read with cat. each file names a command.)',
  '(cat <file> for the riddle.)',
] as const

const CD_HERE = ['/home/dan', '~', '/home/dan/portfolio.sh'] as const

const CD_INTO = [
  (dir: string) => `→ ~/${dir}`,
  (dir: string) => `now in ~/${dir}/`,
  (dir: string) => `~/${dir}`,
] as const

const CD_ERRORS = [
  (arg: string) => `no such directory: ${arg}. try a section or: ${VIRTUAL_DIR_NAMES.join(', ')}`,
  (arg: string) => `cd: ${arg}: not a section or directory. ls to see what's here`,
  (arg: string) => `${arg}? nothing there. ls for the map`,
] as const

const CAT_ERRORS = [
  (arg: string) => `cat: ${arg}: no such file. try a section, or cat a file from a quieter directory`,
  (arg: string) => `cat: ${arg}: not found. ls to see the files`,
  (arg: string) => `${arg} doesn't exist here. ls for options`,
] as const

function formatColumns(names: string[]): string {
  return names.join('   ')
}

async function* lsOutput(ctx: CommandContext): AsyncIterable<TypingChunk> {
  const arg = (ctx.args[0] ?? '').replace(/\/+$/, '').trim()
  let dir: VirtualDirName | null
  if (arg && isVirtualDir(arg)) {
    dir = arg
  } else {
    dir = currentVirtualDir(ctx.cwd)
  }

  if (dir) {
    const files = Object.keys(VIRTUAL_DIRS[dir])
    yield { text: formatColumns(files), delayMs: 60 }
    yield { text: '', newline: true, delayMs: 120 }
    yield { text: pick(DIR_HINTS), delayMs: 200, className: 'text-muted/60' }
    return
  }

  yield { text: 'about.txt      projects/      skills.json      contact.vcf', delayMs: 60 }
  yield {
    text: formatColumns(VIRTUAL_DIR_NAMES.map((d) => `${d}/`)),
    delayMs: 60,
    newline: true,
    className: 'text-muted/60',
  }
}

function lsCommand(): Command {
  return {
    name: 'ls',
    description: 'list files and directories',
    aliases: ['list', 'dir'],
    keywords: ['list', 'files', 'sections', 'dir', 'show', 'explore', 'directories'],
    man: {
      description: 'List the files and directories in the current location. Some directories are quieter than others — cd into them to explore.',
      args: '[directory]',
    },
    run: (ctx) => lsOutput(ctx),
  }
}

function cdCommand(): Command {
  return {
    name: 'cd',
    description: 'jump to a section or directory',
    aliases: ['open', 'go'],
    keywords: ['go', 'jump', 'section', 'scroll', 'navigate', 'open', 'directory', 'explore'],
    man: {
      description: 'Jump to a section (scrolls the page) or move into a virtual directory (changes the prompt). Use `cd ..` or `cd ~` to return to the root.',
      args: '[<section> | <directory> | .. | ~]',
    },
    run: (ctx) => {
      const raw = ctx.args[0] ?? ''
      const arg = raw.replace(/\/+$/, '').trim()

      if (arg === '' || arg === '.' || arg === '..' || arg === '~') {
        if (arg !== '.') ctx.setCwd('~')
        return pick(CD_HERE)
      }

      const section = normalizeSection(raw)
      if (section) {
        ctx.scrollToSection(section)
        ctx.setCwd('~')
        return cdSuccessVariant(section)
      }

      if (isVirtualDir(arg)) {
        ctx.setCwd(`~/${arg}`)
        return pick(CD_INTO)(arg)
      }

      return pick(CD_ERRORS)(raw)
    },
  }
}

function catCommand(): Command {
  return {
    name: 'cat',
    description: 'read a file inline',
    aliases: ['read', 'show'],
    keywords: ['read', 'show', 'view', 'inline', 'print', 'file'],
    man: {
      description: 'Print a section or a catalogue file inline. Inside a quieter directory, cat a file to reveal the riddle and the command it points to.',
      args: '<file>',
    },
    run: (ctx) => {
      const raw = ctx.args[0] ?? ''
      if (!raw) return 'usage: cat <file>'

      const section = normalizeSection(raw)
      if (section) {
        return CAT_CONTENT[section]
      }

      const entry = resolveCatalogue(raw, ctx.cwd)
      if (entry) {
        return `${entry.riddle}\n\ntype \`${entry.command}\` to ${entry.verb}.`
      }

      return pick(CAT_ERRORS)(raw)
    },
  }
}

function resolveCatalogue(
  arg: string,
  cwd: string,
): { riddle: string; command: string; verb: string } | null {
  const pathParsed = parseVirtualPath(arg)
  if (pathParsed) {
    return VIRTUAL_DIRS[pathParsed.dir][pathParsed.file] ?? null
  }
  const dir = currentVirtualDir(cwd)
  if (dir) {
    return VIRTUAL_DIRS[dir][arg] ?? null
  }
  return null
}

export const navigationCommands: Command[] = [lsCommand(), cdCommand(), catCommand()]
