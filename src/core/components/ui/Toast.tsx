import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { create } from 'zustand'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// --- Types ---

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  readonly id: string
  readonly type: ToastType
  readonly message: string
  readonly duration: number
}

interface ToastInput {
  readonly type: ToastType
  readonly message: string
  readonly duration?: number
}

// --- Store ---

interface ToastState {
  readonly toasts: readonly Toast[]
  readonly addToast: (input: ToastInput) => void
  readonly removeToast: (id: string) => void
}

const DEFAULT_DURATION = 5000

let toastCounter = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (input) => {
    const id = `toast-${++toastCounter}`
    const toast: Toast = {
      id,
      type: input.type,
      message: input.message,
      duration: input.duration ?? DEFAULT_DURATION,
    }
    set((state) => ({ toasts: [...state.toasts, toast] }))
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))

// --- Hook ---

export function useToast() {
  const addToast = useToastStore((s) => s.addToast)

  return {
    success: (message: string, duration?: number) =>
      addToast({ type: 'success', message, duration }),
    error: (message: string, duration?: number) => addToast({ type: 'error', message, duration }),
    warning: (message: string, duration?: number) =>
      addToast({ type: 'warning', message, duration }),
    info: (message: string, duration?: number) => addToast({ type: 'info', message, duration }),
  }
}

// --- Icons ---

const typeConfig: Record<ToastType, { icon: ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    className: 'border-success/30 bg-success/10 text-success',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" />,
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    className: 'border-warning/30 bg-warning/10 text-warning',
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    className: 'border-primary/30 bg-primary/10 text-primary',
  },
}

// --- Toast Item ---

function ToastItem({ toast }: { readonly toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast)

  const dismiss = useCallback(() => {
    removeToast(toast.id)
  }, [removeToast, toast.id])

  useEffect(() => {
    const timer = setTimeout(dismiss, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, dismiss])

  const config = typeConfig[toast.type]

  return (
    <div
      className={[
        'flex items-start gap-3 rounded-xl border p-4 shadow-[var(--shadow-lg)] backdrop-blur-sm animate-slide-in-right',
        config.className,
      ].join(' ')}
      role="alert"
    >
      <span className="flex-shrink-0">{config.icon}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={dismiss}
        className="flex-shrink-0 rounded-full p-0.5 opacity-70 transition-opacity duration-200 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// --- Provider ---

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
