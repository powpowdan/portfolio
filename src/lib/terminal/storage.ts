const NAMESPACE = 'portfolio.v1.'

function key(name: string): string {
  return NAMESPACE + name
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
