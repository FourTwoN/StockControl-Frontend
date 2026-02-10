import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly isLoading?: boolean
  readonly children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'gradient-primary text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-[1px]',
  secondary:
    'bg-secondary text-white shadow-[var(--shadow-sm)] hover:bg-secondary/90 hover:-translate-y-[1px]',
  outline:
    'border border-border bg-transparent text-text-primary hover:bg-surface-hover hover:border-primary/30',
  ghost: 'bg-transparent text-text-primary hover:bg-surface-hover',
  destructive:
    'bg-destructive text-white shadow-[var(--shadow-sm)] hover:bg-destructive/90 hover:-translate-y-[1px]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading = false, disabled, children, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})
