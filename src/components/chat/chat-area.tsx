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
  Phone,
  Video,
  MoreHorizontal,
  Image as ImageIcon
} from "lucide-react"
import { Check, CheckCheck } from "lucide-react"

interface ChatAreaProps {
  selectedChat: string | null
  chatName?: string | null
  chatType?: 'user' | 'group'
  onShowProfile: () => void
}

import { useMessages, useUserProfile } from "@/hooks"
import { messagesService } from "@/services"
import type { Message as ChatMessage } from "@/types/message"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const { user } = useUserProfile()

  const { messages, loading, error, sendMessage } = useMessages({
    chatType,
    chatId: selectedChat,
    page: 1,
    limit: 50,
  })

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const mappedMessages = useMemo(() => {
    const base = messages.map((m: ChatMessage) => ({
      id: m.id,
      isUser: user?.id ? m.senderId === user.id : false,
      content: m.content,
      timestamp: formatTime(m.createdAt),
      senderName: m.sender?.username,
    }))
    const pending = outbox.map((m) => ({
      id: m.id || m.tempId,
      isUser: true,
      content: m.content,
      timestamp: formatTime(m.createdAt),
      senderName: user?.username || 'You',
      _status: m.status as 'pending'|'sent'|'delivered',
      _temp: !m.id,
    }))
    return [...base, ...pending]
  }, [messages, user?.id, user?.username, outbox])

  useEffect(() => {
    setOutbox([])
  }, [selectedChat])

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
      const real = await sendMessage(trimmed)
      if (real) {
        // Mark sent and attach real id
        setOutbox(prev => prev.map(m => m.tempId === tempId ? { ...m, id: real.id, status: 'sent' } : m))
        // Confirm delivery by checking message exists
        setTimeout(async () => {
          try {
            if (real.id) {
              await messagesService.getMessage(real.id)
              setOutbox(prev => prev.map(m => m.tempId === tempId ? { ...m, status: 'delivered' } : m))
            }
          } catch {
            // Ignore
          }
        }, 600)
      }
    } catch (e) {
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
    <div className="flex-1 flex flex-col bg-black">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
        <div 
          className="flex items-center cursor-pointer"
          onClick={onShowProfile}
        >
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-zinc-700 text-white">
              {displayName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white">{displayName}</h2>
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Image Preview Area */}
      <div className="p-4 bg-zinc-900 border-b border-zinc-800">
        <div className="bg-zinc-800 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-zinc-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
            <div className="bg-amber-500 text-black px-2 py-1 rounded text-xs font-medium inline-block">
              Today
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="text-center text-gray-400">Loading messages...</div>
        )}
        {error && (
          <div className="text-center text-red-400">{error}</div>
        )}
        {!loading && !error && mappedMessages.map((message: any) => (
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
  )
}
