const NAMESPACE = 'portfolio.v1.'

export const BOOT_SEEN_KEY = 'bootSeen'

function key(name: string): string {
  return NAMESPACE + name
}

export function storageKey(name: string): string {
  return key(name)
}

export function readFlag(name: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(key(name)) === '1'
  } catch {
    return false
  }
}

export function writeFlag(name: string, value: boolean): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key(name), value ? '1' : '0')
  } catch {
    // ignore
  }
}

export function readSet(name: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key(name))
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return []
  }
}

export function writeSet(name: string, values: Iterable<string>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key(name), JSON.stringify(Array.from(new Set(values))))
  } catch {
    // ignore
  }
}
