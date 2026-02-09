import { useState, useCallback, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle, Bot } from 'lucide-react'
import { Button } from '@core/components/ui/Button'
import { Skeleton } from '@core/components/ui/Skeleton'
import { MessageBubble } from './MessageBubble.tsx'
import { ToolResultCard } from './ToolResultCard.tsx'
import { ChartRenderer } from './ChartRenderer.tsx'
import { useChatMessages } from '../hooks/useChatMessages.ts'
import { useSendMessage } from '../hooks/useSendMessage.ts'
import type { ChatMessage } from '../types/Chat.ts'

interface ChatWindowProps {
  readonly sessionId: string
}

function StreamingIndicator({
  content,
  toolExecutions,
  chartData,
}: {
  readonly content: string
  readonly toolExecutions: readonly import('../types/Chat.ts').ToolExecution[]
  readonly chartData: import('../types/Chat.ts').ChartData | null
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm text-primary">
          <p className="whitespace-pre-wrap">
            {content}
            <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-primary" />
          </p>
        </div>

        {toolExecutions.length > 0 && (
          <div className="mt-2">
            {toolExecutions.map((execution) => (
              <ToolResultCard key={execution.id} execution={execution} />
            ))}
          </div>
        )}

        {chartData && <ChartRenderer chartData={chartData} />}
      </div>
    </div>
  )
}

function MessageList({
  messages,
  isLoading,
}: {
  readonly messages: readonly ChatMessage[]
  readonly isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="ml-auto h-8 w-1/2" />
        <Skeleton className="h-16 w-3/4" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <p className="text-lg font-medium text-primary">Start a conversation</p>
        <p className="max-w-sm text-sm text-muted">
          Ask questions about your inventory, sales data, or request analytics reports.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  )
}

function ErrorBanner({ error }: { readonly error: string }) {
  return (
    <div className="mx-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{error}</span>
    </div>
  )
}

export function ChatWindow({ sessionId }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: messages, isLoading: isLoadingMessages } =
    useChatMessages(sessionId)

  const {
    sendMessage,
    isStreaming,
    streamedContent,
    activeToolExecutions,
    chartData,
    error,
  } = useSendMessage(sessionId)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedContent, scrollToBottom])

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (trimmed.length === 0 || isStreaming) return

    void sendMessage(trimmed)
    setInput('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, isStreaming, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)

      const textarea = e.target
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120).toString()}px`
    },
    [],
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages ?? []}
          isLoading={isLoadingMessages}
        />

        {isStreaming && streamedContent.length > 0 && (
          <div className="px-4 pb-4">
            <StreamingIndicator
              content={streamedContent}
              toolExecutions={activeToolExecutions}
              chartData={chartData}
            />
          </div>
        )}

        {error && <ErrorBanner error={error} />}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Message input"
          />
          <Button
            onClick={handleSubmit}
            disabled={input.trim().length === 0 || isStreaming}
            size="md"
            aria-label="Send message"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
