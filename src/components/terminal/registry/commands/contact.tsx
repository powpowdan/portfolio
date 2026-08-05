import type { Command } from '../types'

const EMAIL = 'daniel.brown.gov@gmail.com'
const GITHUB_URL = 'https://github.com/powpowdan'
const LINKEDIN_URL = '#'
const RESUME_PATH = '/resume.docx'

function resumeCommand(): Command {
  return {
    name: 'resume',
    description: 'download résumé',
    aliases: ['cv'],
    keywords: ['resume', 'cv', 'download', 'doc', 'word', 'job', 'work'],
    man: { description: 'Download the résumé as a .docx file.' },
    run: () => {
      if (typeof window !== 'undefined') {
        const a = window.document.createElement('a')
        a.href = RESUME_PATH
        a.download = 'resume.docx'
        window.document.body.appendChild(a)
        a.click()
        a.remove()
      }
      return 'downloading resume.docx ...'
    },
  }
}

function emailCommand(): Command {
  return {
    name: 'email',
    description: 'send an email',
    aliases: ['mail', 'mailto'],
    keywords: ['email', 'mail', 'contact', 'reach'],
    man: { description: 'Open a mailto link to the author.' },
    run: () => {
      if (typeof window !== 'undefined') {
        window.location.href = `mailto:${EMAIL}`
      }
      return EMAIL
    },
  }
}

function githubCommand(): Command {
  return {
    name: 'github',
    description: 'open github',
    aliases: ['gh', 'git'],
    keywords: ['github', 'git', 'code', 'repo', 'source'],
    man: { description: 'Open the author GitHub profile in a new tab.' },
    run: () => {
      if (typeof window !== 'undefined') {
        window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
      }
      return GITHUB_URL
    },
  }
}

function linkedinCommand(): Command {
  return {
    name: 'linkedin',
    description: 'open linkedin',
    aliases: ['li'],
    keywords: ['linkedin', 'social', 'work', 'connect'],
    man: { description: 'Open the author LinkedIn profile in a new tab.' },
    run: () => {
      if (typeof window !== 'undefined') {
        window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer')
      }
      return LINKEDIN_URL === '#' ? 'linkedin: link not configured yet' : LINKEDIN_URL
    },
  }
}

export const contactCommands: Command[] = [
  resumeCommand(),
  emailCommand(),
  githubCommand(),
  linkedinCommand(),
]
