import type { TypingChunk } from './registry/types'

export function isTypingStream(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  return (
    typeof (value as { [Symbol.asyncIterator]?: unknown })[Symbol.asyncIterator] === 'function'
  )
}

export async function drainStream(stream: AsyncIterable<TypingChunk>): Promise<TypingChunk[]> {
  const chunks: TypingChunk[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return chunks
}
