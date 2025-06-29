"use client"

import { useState } from "react"
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
  onShowProfile: () => void
}

interface Message {
  id: string
  sender: "user" | "other"
  content: string
  timestamp: string
  type?: "text" | "image"
}

const messages: Message[] = [
  {
    id: "1",
    sender: "other",
    content: "text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text",
    timestamp: "12:35 pm"
  },
  {
    id: "2", 
    sender: "other",
    content: "text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text",
    timestamp: "12:35 pm"
  },
  {
    id: "3",
    sender: "other", 
    content: "text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text",
    timestamp: "12:35 pm"
  },
  {
    id: "4",
    sender: "user",
    content: "text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text",
    timestamp: "12:35 pm"
  },
  {
    id: "5",
    sender: "user",
    content: "text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text",
    timestamp: "12:35 pm"
  }
]

export function ChatArea({ selectedChat, onShowProfile }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("")

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // Handle sending message logic here
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
              {selectedChat.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white">{selectedChat}</h2>
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
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            {/* Sender Label */}
            <div className={cn(
              "flex items-center mb-1",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}>
              <span className="text-xs text-gray-400 font-medium">
                {message.sender === "user" ? "You" : selectedChat}
              </span>
              <span className="text-xs text-gray-500 ml-2">{message.timestamp}</span>
            </div>
            
            {/* Message Bubble */}
            <div className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}>            <div className={cn(
              "max-w-[70%] rounded-lg p-3 text-sm",
              message.sender === "user" 
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
              onKeyPress={(e) => {
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
