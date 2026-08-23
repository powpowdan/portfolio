import type { Command } from './types'
import { navigationCommands } from './commands/navigation'
import { infoCommands } from './commands/info'
import { contactCommands } from './commands/contact'
import { shellCommands } from './commands/shell'
import { discoverabilityCommands } from './commands/discoverability'
import { trophiesCommands } from './commands/trophies'
import { loreCommands } from './commands/lore'
import { filmCommands } from './commands/films'
import { gagCommands } from './commands/gags'

export const ALL_COMMANDS: Command[] = [
  ...navigationCommands,
  ...infoCommands,
  ...contactCommands,
  ...shellCommands,
  ...discoverabilityCommands,
  ...trophiesCommands,
  ...loreCommands,
  ...filmCommands,
  ...gagCommands,
]

const COMMAND_BY_NAME: Map<string, Command> = (() => {
  const map = new Map<string, Command>()
  for (const cmd of ALL_COMMANDS) {
    map.set(cmd.name, cmd)
    for (const alias of cmd.aliases ?? []) map.set(alias, cmd)
  }
  return map
})()

export function resolveCommand(name: string): Command | undefined {
  if (!name) return undefined
  return COMMAND_BY_NAME.get(name.toLowerCase())
}

export function allCommandNames(): string[] {
  const names = new Set<string>()
  for (const cmd of ALL_COMMANDS) {
    names.add(cmd.name)
    for (const alias of cmd.aliases ?? []) names.add(alias)
  }
  return Array.from(names)
}

export function allCommandKeywords(): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const cmd of ALL_COMMANDS) {
    map.set(cmd.name, cmd.keywords ?? [])
  }
  return map
}
