'use client'

import { Icon } from '@iconify/react'

// Mapping emoji character → twemoji iconify ID
const EMOJI_MAP: Record<string, string> = {
  '🚧': 'twemoji:construction',
  '☠️': 'twemoji:skull-and-crossbones',
  '🚜': 'twemoji:tractor',
  '🏡': 'twemoji:house-with-garden',
  '🥷': 'twemoji:ninja',
  '🔥': 'twemoji:fire',
  '🪁': 'twemoji:kite',
  '🚨': 'twemoji:police-car-light',
  '⚡': 'twemoji:high-voltage',
  '🏗️': 'twemoji:building-construction',
  '📊': 'twemoji:bar-chart',
  '📍': 'twemoji:round-pushpin',
  '⚠️': 'twemoji:warning',
  '✅': 'twemoji:check-mark-button',
  '❌': 'twemoji:cross-mark',
}

interface TwIconProps {
  emoji: string
  size?: number | string
  className?: string
  style?: React.CSSProperties
}

export function TwIcon({ emoji, size = 24, className, style }: TwIconProps) {
  const iconId = EMOJI_MAP[emoji]
  if (!iconId) return <span style={{ fontSize: size }}>{emoji}</span>
  return (
    <Icon
      icon={iconId}
      width={size}
      height={size}
      className={className}
      style={style}
    />
  )
}
