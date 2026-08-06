'use client'

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ActiveOverlay } from '../registry/types'
import BreatheOverlay from './BreatheOverlay'
import MatrixRainOverlay from './MatrixRainOverlay'
import WickDesatOverlay from './WickDesatOverlay'
import DriveWashOverlay from './DriveWashOverlay'

interface OverlayHostProps {
  overlay: ActiveOverlay
  onDismiss: () => void
}

export default function OverlayHost({ overlay, onDismiss }: OverlayHostProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss])

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
    default:
      content = null
  }

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}
