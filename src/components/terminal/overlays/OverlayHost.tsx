'use client'

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ActiveOverlay } from '../registry/types'
import BreatheOverlay from './BreatheOverlay'
import MatrixRainOverlay from './MatrixRainOverlay'
import WickDesatOverlay from './WickDesatOverlay'
import DriveWashOverlay from './DriveWashOverlay'
import DeletionOverlay from './DeletionOverlay'

interface OverlayHostProps {
  overlay: ActiveOverlay
  onDismiss: () => void
}

export default function OverlayHost({ overlay, onDismiss }: OverlayHostProps) {
  const dismissable = overlay.kind !== 'deletion'

  useEffect(() => {
    if (!dismissable) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss, dismissable])

  let content: ReactNode = null
  switch (overlay.kind) {
    case 'breathe':
      content = <BreatheOverlay mode={overlay.props?.mode ?? 'calm'} onDismiss={onDismiss} />
      break
    case 'matrix':
      content = <MatrixRainOverlay onDismiss={onDismiss} />
      break
    case 'wick':
      content = <WickDesatOverlay onDismiss={onDismiss} />
      break
    case 'drive':
      content = <DriveWashOverlay onDismiss={onDismiss} />
      break
    case 'deletion':
      content = <DeletionOverlay />
      break
    default:
      content = null
  }

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
