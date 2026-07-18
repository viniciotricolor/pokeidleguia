'use client';

import { TYPE_COLORS, TYPE_ABBR, TYPE_GRADIENTS } from '@/lib/types';
interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}
export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const gradient = TYPE_GRADIENTS[type];
  const abbr = TYPE_ABBR[type] || type.slice(0, 3).toUpperCase();

  const sizeClasses = size === 'sm'
    ? 'px-1.5 py-0.5 text-[10px]'
    : size === 'lg'
    ? 'px-3 py-1.5 text-sm'
    : 'px-2 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded ${sizeClasses} text-white shadow-sm`}
      style={gradient
        ? { background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }
        : { backgroundColor: TYPE_COLORS[type] || '#888' }
      }
    >
      {abbr}
    </span>
  );
}
