import { execSync } from 'child_process'

export function getGitSha(): string {
  try {
    const sha = execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return sha || 'build unknown'
  } catch {
    return 'build unknown'
  }
}
