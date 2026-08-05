const lastPicks = new Map<readonly unknown[], unknown>()

export function pick<T>(arr: readonly T[]): T {
  if (arr.length <= 1) return arr[0]
  let result = arr[Math.floor(Math.random() * arr.length)]
  while (result === lastPicks.get(arr)) {
    result = arr[Math.floor(Math.random() * arr.length)]
  }
  lastPicks.set(arr, result)
  return result
}
