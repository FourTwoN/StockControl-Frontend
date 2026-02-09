import type { ReactNode, MouseEventHandler } from 'react'

interface CardProps {
  readonly children: ReactNode
  readonly className?: string
  readonly onClick?: MouseEventHandler<HTMLDivElement>
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-border bg-surface p-4 shadow-sm',
        onClick ? 'cursor-pointer transition-shadow hover:shadow-md' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
              }
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
