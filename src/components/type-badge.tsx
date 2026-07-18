'use client';

import { TYPE_COLORS, TYPE_ABBR } from '@/lib/types';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] || '#888';
  const abbr = TYPE_ABBR[type] || type.slice(0, 3).toUpperCase();

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded
        ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}
      `}
      style={{ backgroundColor: `${color}22`, color }}
    >
      {abbr}
    </span>
  );
}
