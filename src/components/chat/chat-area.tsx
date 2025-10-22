"use client"

import { useMemo, useState } from "react"
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

interface ChatAreaProps {
  selectedChat: string | null
  chatName?: string | null
  chatType?: 'user' | 'group'
  onShowProfile: () => void
}

import { useMessages, useUserProfile } from "@/hooks"
import type { Message as ChatMessage } from "@/types/message"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ChatArea({ selectedChat, chatName, chatType = 'user', onShowProfile }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("")
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
    return messages.map((m: ChatMessage) => ({
      id: m.id,
      isUser: user?.id ? m.senderId === user.id : false,
      content: m.content,
      timestamp: formatTime(m.createdAt),
      senderName: m.sender?.username,
    }))
  }, [messages, user?.id])

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    )
  }

  const displayName = chatName || selectedChat

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    await sendMessage(newMessage)
    setNewMessage("")
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
                  handleSendMessage()
                }
              }}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            className="bg-amber-500 hover:bg-amber-600 text-black"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
