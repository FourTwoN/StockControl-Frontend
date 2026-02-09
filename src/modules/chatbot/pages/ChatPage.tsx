import { useState, useCallback } from 'react'
import { Plus, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Button } from '@core/components/ui/Button'
import { Card } from '@core/components/ui/Card'
import { Skeleton } from '@core/components/ui/Skeleton'
import { ChatWindow } from '../components/ChatWindow.tsx'
import { useChatSessions } from '../hooks/useChatSessions.ts'
import { chatService } from '../services/chatService.ts'
import type { ChatSession } from '../types/Chat.ts'

function SessionCard({
  session,
  isSelected,
  onSelect,
}: {
  readonly session: ChatSession
  readonly isSelected: boolean
  readonly onSelect: (id: string) => void
}) {
  const handleClick = useCallback(() => {
    onSelect(session.id)
  }, [session.id, onSelect])

  const formattedDate = session.lastMessageAt
    ? format(new Date(session.lastMessageAt), 'dd/MM HH:mm')
    : format(new Date(session.createdAt), 'dd/MM HH:mm')

  return (
    <Card
      onClick={handleClick}
      className={[
        'transition-colors',
        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-surface',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start gap-3">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-primary">
            {session.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span>{session.messageCount} messages</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function SessionListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={`skeleton-${i.toString()}`} className="p-4">
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function SessionSidebar({
  sessions,
  selectedId,
  isLoading,
  isCreating,
  onSelect,
  onNewChat,
}: {
  readonly sessions: readonly ChatSession[]
  readonly selectedId: string
  readonly isLoading: boolean
  readonly isCreating: boolean
  readonly onSelect: (id: string) => void
  readonly onNewChat: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold text-primary">Chats</h2>
        <Button
          size="sm"
          onClick={onNewChat}
          disabled={isCreating}
          aria-label="New chat"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <SessionListSkeleton />
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <MessageSquare className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">No conversations yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isSelected={session.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyChatPanel({ onNewChat }: { readonly onNewChat: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MessageSquare className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-primary">Demeter AI Chat</h2>
      <p className="max-w-md text-sm text-muted">
        Ask questions about your inventory, get sales insights, or request data analysis.
        Select an existing conversation or start a new one.
      </p>
      <Button onClick={onNewChat}>
        <Plus className="h-4 w-4" />
        Start New Chat
      </Button>
    </div>
  )
}

export function ChatPage() {
  const queryClient = useQueryClient()
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [showSidebar, setShowSidebar] = useState(true)

  const { data: sessions, isLoading: isLoadingSessions } = useChatSessions()

  const createSession = useMutation({
    mutationFn: () => chatService.createSession(),
    onSuccess: (newSession) => {
      void queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      setSelectedSessionId(newSession.id)
      setShowSidebar(false)
    },
  })

  const handleSelectSession = useCallback((id: string) => {
    setSelectedSessionId(id)
    setShowSidebar(false)
  }, [])

  const handleNewChat = useCallback(() => {
    createSession.mutate()
  }, [createSession])

  const handleBackToSidebar = useCallback(() => {
    setShowSidebar(true)
  }, [])

  const hasSelectedSession = selectedSessionId.length > 0

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col sm:flex-row">
      {/* Mobile: toggle between sidebar and chat */}
      <div
        className={[
          'h-full w-full border-r border-border bg-background sm:block sm:w-80 sm:shrink-0',
          showSidebar ? 'block' : 'hidden',
        ].join(' ')}
      >
        <SessionSidebar
          sessions={sessions ?? []}
          selectedId={selectedSessionId}
          isLoading={isLoadingSessions}
          isCreating={createSession.isPending}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>

      <div
        className={[
          'flex h-full flex-1 flex-col',
          showSidebar ? 'hidden sm:flex' : 'flex',
        ].join(' ')}
      >
        {/* Mobile back button */}
        <div className="flex items-center border-b border-border p-2 sm:hidden">
          <Button variant="ghost" size="sm" onClick={handleBackToSidebar}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {hasSelectedSession ? (
          <ChatWindow sessionId={selectedSessionId} />
        ) : (
          <EmptyChatPanel onNewChat={handleNewChat} />
        )}
      </div>
    </div>
  )
}
