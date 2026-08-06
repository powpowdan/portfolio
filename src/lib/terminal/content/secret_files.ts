export type VirtualDirName = 'rituals' | 'films' | 'lore' | 'gags'

export interface CatalogueEntry {
  riddle: string
  command: string
  verb: string
}

export const VIRTUAL_DIR_NAMES: VirtualDirName[] = ['rituals', 'films', 'lore', 'gags']

export const VIRTUAL_DIRS: Record<VirtualDirName, Record<string, CatalogueEntry>> = {
  rituals: {
    'breathe.metric': {
      riddle: 'a circle widens, then folds back. match it.',
      command: 'breathe',
      verb: 'begin',
    },
    'matrix.kat': {
      riddle: 'the rain falls in katakana. follow the white rabbit.',
      command: 'matrix',
      verb: 'wake up',
    },
    'wick.table': {
      riddle: 'excommunicado. the color drains from the table.',
      command: 'wick',
      verb: 'descend',
    },
    'drive.road': {
      riddle: 'a real human being. a real hero. watch the road wash.',
      command: 'drive',
      verb: 'ride',
    },
    'wish.1111': {
      riddle: 'make the wish when the clock repeats.',
      command: '1111',
      verb: 'send',
    },
  },
  films: {
    'fight.club': {
      riddle: 'the first rule is the second rule.',
      command: 'fight',
      verb: 'recite the rules',
    },
    'samurai.hagakure': {
      riddle: 'the way is found in death. life in every breath.',
      command: 'samurai',
      verb: 'walk the way',
    },
    'heat.doctrine': {
      riddle: "don't attach to anything you won't walk out on in thirty seconds flat.",
      command: 'heat',
      verb: 'learn the doctrine',
    },
    'bat.tannhauser': {
      riddle: 'all those moments lost in time, like tears in rain.',
      command: 'bat',
      verb: 'see them',
    },
    'gladiator.elysium': {
      riddle: 'what we do in life echoes in eternity.',
      command: 'gladiator',
      verb: 'enter elysium',
    },
  },
  lore: {
    'kitchen.line': {
      riddle: 'ten years on the line. ran the business. left six years ago.',
      command: 'kitchen',
      verb: 'hear the old life',
    },
    'train.eight': {
      riddle: 'eight limbs. breath. discipline.',
      command: 'train',
      verb: 'see the practice',
    },
  },
  gags: {
    'sudo.denied': {
      riddle: 'you are not authorized.',
      command: 'sudo',
      verb: 'try anyway',
    },
    'rm.safe': {
      riddle: "you wouldn't download a portfolio.",
      command: 'rm',
      verb: 'attempt removal',
    },
    'vim.trap': {
      riddle: 'you will not escape.',
      command: 'vim',
      verb: 'enter the editor',
    },
    'emacs.sink': {
      riddle: 'the kitchen sink allocates 8GB.',
      command: 'emacs',
      verb: 'sink',
    },
    'nano.friendly': {
      riddle: 'the one editor that lets you leave.',
      command: 'nano',
      verb: 'open',
    },
    'hack.planet': {
      riddle: 'hack the planet. ICE-breaker engaged.',
      command: 'hack',
      verb: 'burst',
    },
  },
}

export function isVirtualDir(name: string): name is VirtualDirName {
  return (VIRTUAL_DIR_NAMES as readonly string[]).includes(name)
}

export function parseVirtualPath(
  arg: string,
): { dir: VirtualDirName; file: string } | null {
  const slash = arg.indexOf('/')
  if (slash < 0) return null
  const dir = arg.slice(0, slash).replace(/\/+$/, '').trim()
  const file = arg.slice(slash + 1).replace(/\/+$/, '').trim()
  if (!dir || !file) return null
  return isVirtualDir(dir) ? { dir, file } : null
}
