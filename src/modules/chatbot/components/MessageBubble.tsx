import { Bot, User } from 'lucide-react'
import { ToolResultCard } from './ToolResultCard.tsx'
import { ChartRenderer } from './ChartRenderer.tsx'
import type { ChatMessage } from '../types/Chat.ts'

interface MessageBubbleProps {
  readonly message: ChatMessage
}

function UserAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
      <User className="h-4 w-4" />
    </div>
  )
}

function AssistantAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
      <Bot className="h-4 w-4" />
    </div>
  )
}

function UserBubble({ message }: MessageBubbleProps) {
  return (
    <div className="flex items-start justify-end gap-2">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-white">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      <UserAvatar />
    </div>
  )
}

function AssistantBubble({ message }: MessageBubbleProps) {
  return (
    <div className="flex items-start gap-2">
      <AssistantAvatar />
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm text-primary">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.toolExecutions && message.toolExecutions.length > 0 && (
          <div className="mt-2">
            {message.toolExecutions.map((execution) => (
              <ToolResultCard key={execution.id} execution={execution} />
            ))}
          </div>
        )}

        {message.chartData && <ChartRenderer chartData={message.chartData} />}
      </div>
    </div>
  )
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'user') {
    return <UserBubble message={message} />
  }

  return <AssistantBubble message={message} />
}
