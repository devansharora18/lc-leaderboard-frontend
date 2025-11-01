"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  Send, 
  Paperclip, 
  Smile,
  
} from "lucide-react"
import { Check, CheckCheck } from "lucide-react"

interface ChatAreaProps {
  selectedChat: string | null
  chatName?: string | null
  chatType?: 'user' | 'group'
  onShowProfile: () => void
}

import { useMessages, useUserProfile } from "@/hooks"
import { messagesService, socketService } from "@/services"
import type { Message as ChatMessage } from "@/types/message"
import { GroupDetailsDialog } from "@/components/groups/group-details-dialog"

export function ChatArea({ selectedChat, chatName, chatType = 'user', onShowProfile }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const sendingRef = useRef(false)
  const [outbox, setOutbox] = useState<Array<{
    tempId: string
    id?: string
    content: string
    createdAt: string
    status: 'pending' | 'sent' | 'delivered'
  }>>([])
  const [inbox, setInbox] = useState<ChatMessage[]>([])
  const seenIdsRef = useRef<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const { user } = useUserProfile()

  const { messages, loading, error, sendMessage } = useMessages({
    chatType,
    chatId: selectedChat,
    page: 1,
    limit: 50,
  })

  const groupId = selectedChat && selectedChat.startsWith('group-') ? selectedChat.replace('group-', '') : selectedChat || null

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  type MappedMessage = {
    id: string
    isUser: boolean
    content: string
    timestamp: string
    senderName?: string
    _status?: 'pending' | 'sent' | 'delivered'
    _temp?: boolean
  }

  const mappedMessages = useMemo<MappedMessage[]>(() => {
    // Dedupe base + inbox by id
    const all: ChatMessage[] = []
    const used = new Set<string>()
    messages.forEach((m) => {
      if (!used.has(m.id)) { used.add(m.id); all.push(m) }
    })
    inbox.forEach((m) => {
      if (!used.has(m.id)) { used.add(m.id); all.push(m) }
    })

    const base: MappedMessage[] = all.map((m: ChatMessage) => ({
      id: m.id,
      isUser: user?.id ? m.senderId === user.id : false,
      content: m.content,
      timestamp: formatTime(m.createdAt),
      senderName: m.sender?.username,
    }))
    const pending: MappedMessage[] = outbox.map((m) => ({
      id: m.id || m.tempId,
      isUser: true,
      content: m.content,
      timestamp: formatTime(m.createdAt),
      senderName: user?.username || 'You',
      _status: m.status as 'pending'|'sent'|'delivered',
      _temp: !m.id,
    }))
    return [...base, ...pending]
  }, [messages, inbox, user?.id, user?.username, outbox])

  useEffect(() => {
    setOutbox([])
    setInbox([])
    seenIdsRef.current.clear()
  }, [selectedChat])

  // Auto-scroll to the latest message when the list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mappedMessages.length, selectedChat])

  // Socket join/leave and receive handler for group chats
  useEffect(() => {
    const gid = groupId
    if (chatType !== 'group' || !gid) return

    let unsub: (() => void) | undefined
    let active = true

    ;(async () => {
      await socketService.ensureConnected()
      await socketService.joinGroup(gid)
      unsub = socketService.onMessage((payload) => {
        if (!active) return
        if (payload.groupId !== gid) return
        // Normalize payload into ChatMessage
        const createdAt = (typeof payload.timestamp === 'string') ? new Date(payload.timestamp).toISOString() : payload.timestamp.toISOString()
        const normalized: ChatMessage = {
          id: payload.id,
          content: payload.message,
          senderId: payload.sender?.id,
          groupId: payload.groupId,
          createdAt,
          updatedAt: createdAt,
          sender: payload.sender ? { id: payload.sender.id, username: payload.sender.username } : undefined,
        }
        // Dedupe by id across seen set, base messages, and outbox
        if (seenIdsRef.current.has(normalized.id)) return
        // If this is my own message, try to match pending outbox by content and mark delivered
        if (user?.id && normalized.senderId === user.id) {
          // Find latest pending with same content
          setOutbox((prev) => {
            const idx = [...prev].reverse().findIndex((m) => m.status !== 'delivered' && m.content === normalized.content)
            if (idx === -1) return prev
            // reverse index to real index
            const rIdx = prev.length - 1 - idx
            const next = [...prev]
            next[rIdx] = { ...next[rIdx], id: normalized.id, status: 'delivered' }
            return next
          })
          // Also record id as seen to avoid adding to inbox
          seenIdsRef.current.add(normalized.id)
          return
        }
        // For others' messages, append to inbox if not already in base
        setInbox((prev) => {
          if (prev.some((m) => m.id === normalized.id)) return prev
          seenIdsRef.current.add(normalized.id)
          return [...prev, normalized]
        })
      })
    })()

    return () => {
      active = false
      if (unsub) unsub()
      socketService.leaveGroup(gid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatType, groupId])

  

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    )
  }

  const displayName = chatName || selectedChat

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim()
    if (!trimmed) return
    if (sendingRef.current || isSending) return
    // Clear input immediately
    setNewMessage("")
    sendingRef.current = true
    setIsSending(true)
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const createdAt = new Date().toISOString()
    setOutbox(prev => [...prev, { tempId, content: trimmed, createdAt, status: 'pending' }])
    try {
      let sentOk = false
      if (chatType === 'group' && groupId) {
        // Prefer Socket.IO send for realtime broadcast
        sentOk = await socketService.sendMessage(groupId, trimmed, user ? { id: user.id, username: user.username || 'You' } : undefined)
      }
      // Fallback to REST if socket path failed or not group chat
      if (!sentOk) {
        const real = await sendMessage(trimmed)
        if (real) {
          setOutbox(prev => prev.map(m => m.tempId === tempId ? { ...m, id: real.id, status: 'sent' } : m))
          setTimeout(async () => {
            try {
              if (real.id) {
                await messagesService.getMessage(real.id)
                setOutbox(prev => prev.map(m => m.tempId === tempId ? { ...m, status: 'delivered' } : m))
              }
            } catch {}
          }, 600)
        }
      } else {
        // With socket path, we'll mark delivered when echo arrives; mark as sent for now
        setOutbox(prev => prev.map(m => m.tempId === tempId ? { ...m, status: 'sent' } : m))
      }
    } catch {
      // Restore input on failure
      setNewMessage(trimmed)
      // Remove temp bubble
      setOutbox(prev => prev.filter(m => m.tempId !== tempId))
    } finally {
      sendingRef.current = false
      setIsSending(false)
    }
  }

  return (
    <>
    <div className="flex-1 flex flex-col bg-black">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center">
          <Avatar 
            className="h-10 w-10 mr-3 cursor-pointer"
            onClick={() => {
              if (chatType === 'group' && groupId) {
                setGroupDialogOpen(true)
              } else {
                onShowProfile()
              }
            }}
          >
            <AvatarFallback className="bg-zinc-700 text-white">
              {displayName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white">{displayName}</h2>
            {/* <span className="text-xs text-gray-400">Online</span> */}
          </div>
        </div>
        
        {/* Removed call, video, and menu buttons as requested */}
      </div>

      {/* Removed image preview area as requested */}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="text-center text-gray-400">Loading messages...</div>
        )}
        {error && (
          <div className="text-center text-red-400">{error}</div>
        )}
        {!loading && !error && mappedMessages.map((message) => (
          <div key={message.id} className="flex flex-col">
            {/* Sender Label */}
            <div className={cn(
              "flex items-center mb-1",
              message.isUser ? "justify-end" : "justify-start"
            )}>
              <span className="text-xs text-gray-400 font-medium">
                {message.isUser ? "You" : (message.senderName || displayName)}
              </span>
              <span className="text-xs text-gray-500 ml-2">{message.timestamp}</span>
            </div>
            
            {/* Message Bubble */}
            <div className={cn(
              "flex",
              message.isUser ? "justify-end" : "justify-start"
            )}>            <div className={cn(
              "max-w-[70%] rounded-lg p-3 text-sm",
              message.isUser 
                ? "bg-amber-500 text-black ml-auto" 
                : "bg-zinc-800 text-white"
            )}>
              {message.content}
            </div>
            </div>

            {/* Status ticks (only for user's outbox messages) */}
            {message.isUser && message._status && (
              <div className="flex justify-end mt-1 text-[10px] text-gray-400 pr-1">
                {message._status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 opacity-60" />
                    <span>Sending…</span>
                  </div>
                )}
                {message._status === 'sent' && (
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Sent</span>
                  </div>
                )}
                {message._status === 'delivered' && (
                  <div className="flex items-center gap-1">
                    <CheckCheck className="h-3 w-3" />
                    <span>Delivered</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 pr-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={isSending}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isSending}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            className="bg-amber-500 hover:bg-amber-600 text-black"
            size="sm"
            disabled={isSending || newMessage.trim().length === 0}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
    <GroupDetailsDialog
      groupId={chatType === 'group' ? groupId : null}
      open={groupDialogOpen}
      onOpenChange={setGroupDialogOpen}
    />
    </>
  )
}
