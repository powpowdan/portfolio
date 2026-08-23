import type { Command, TypingChunk } from '../types'
import { isRoot } from '../../../../lib/terminal/discovery'

function sudoCommand(): Command {
  return {
    name: 'sudo',
    description: '—',
    hidden: true,
    category: 'gags',
    keywords: ['sudo', 'admin', 'root', 'permission', 'elevated', 'superuser'],
    man: { description: 'Execute a command as superuser. (You are not authorized.)' },
    run: (ctx) => {
      if (isRoot()) {
        return 'permission granted. it was always your machine.'
      }
      const attempted = ctx.raw || '<nothing>'
      const lines = [
        `[sudo] password for guest: `,
        `permission denied — Ono-Sendai not authorized.`,
        `(you tried to sudo ${attempted}. cute.)`,
      ]
      return (async function* (): AsyncIterable<TypingChunk> {
        for (const line of lines) {
          yield { text: line, delayMs: 220, className: line.startsWith('permission') ? 'text-red-400/80' : 'text-white/70', newline: true }
        }
      })()
    },
  }
}

function rmCommand(): Command {
  return {
    name: 'rm',
    description: '—',
    hidden: true,
    category: 'gags',
    keywords: ['rm', 'delete', 'remove', 'destroy', 'recursive'],
    man: { description: 'Remove files or directories. (Gag.)' },
    run: (ctx) => {
      const target = ctx.args.join(' ')
      const destructive = /^-r?f?\/?$/.test(target) || target.startsWith('/') || target.includes('-rf')
      if (!destructive) {
        return `rm: ${target || 'missing operand'}: nothing happened. (phew.)`
      }
      if (isRoot()) {
        ctx.requestConfirm('delete everything? [y/N]')
        return null
      }
      const lines = [
        `you wouldn't download a portfolio...`,
        `> refusing to remove ${target}`,
        `> the construct is safe. for now.`,
      ]
      return lines.join('\n')
    },
  }
}

function vimCommand(): Command {
  return {
    name: 'vim',
    description: '—',
    hidden: true,
    category: 'gags',
    keywords: ['vim', 'editor', 'vi', 'edit'],
    man: { description: 'The editor. (Good luck escaping.)' },
    run: () => {
      const lines = [
        `entering vim...`,
        ``,
        `# press :q! to escape (you will not)`,
        `# press :wq if you must`,
        ``,
        `> exiting vim...`,
        `> (editor war: vim wins this round. see also: emacs)`,
      ]
      return lines.join('\n')
    },
  }
}

function emacsCommand(): Command {
  return {
    name: 'emacs',
    description: '—',
    hidden: true,
    category: 'gags',
    keywords: ['emacs', 'editor', 'edit'],
    man: { description: 'A shell pretending to be an editor. Or vice versa.' },
    run: () => {
      const lines = [
        `starting emacs...`,
        `> allocating 8GB for the kitchen sink...`,
        `> (no. just no. use vim.)`,
      ]
      return lines.join('\n')
    },
  }
}

function nanoCommand(): Command {
  return {
    name: 'nano',
    description: '—',
    hidden: true,
    category: 'gags',
    keywords: ['nano', 'editor', 'edit', 'pico', 'simple'],
    man: { description: 'The editor that just lets you leave.' },
    run: () => {
      const lines = [
        `opening nano...`,
        ``,
        `  ^O write out   ^X exit`,
        `  (it just works. no war today.)`,
        ``,
        `> exiting nano. that was painless.`,
        `> (editor war: vim and emacs didn't even notice.)`,
      ]
      return lines.join('\n')
    },
  }
}

function hackCommand(): Command {
  return {
    name: 'hack',
    description: '—',
    hidden: true,
    category: 'gags',
    keywords: ['hack', 'glitch', 'matrix', 'cool', 'break'],
    man: { description: 'Hack the planet. (Triggers a glitch burst.)' },
    run: (ctx) => {
      ctx.triggerGlitch()
      const lines = [
        `initializing intrusion countermeasures...`,
        `deploying ICE-breaker...`,
        `> signal burst engaged.`,
      ]
      return lines.join('\n')
    },
  }
}

export const gagCommands: Command[] = [sudoCommand(), rmCommand(), vimCommand(), emacsCommand(), nanoCommand(), hackCommand()]
