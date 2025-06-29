"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  MessageCircle, 
  Users, 
  Heart, 
  Gift, 
  Settings
} from "lucide-react"

interface ChatSidebarProps {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

const chatData = [
  {
    id: "penny-valeria-1",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-2", 
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-3",
    name: "Penny Valeria", 
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-4",
    name: "Penny Valeria",
    lastMessage: "text text text text...", 
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-5",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm", 
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-6",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-7",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-8",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-9",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-10",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-11",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "penny-valeria-12",
    name: "Penny Valeria",
    lastMessage: "text text text text...",
    time: "12:35 pm",
    unread: true,
    avatar: ""
  },
  {
    id: "silent-perfection",
    name: "Silent Perfection",
    lastMessage: "Admin",
    time: "12:35 pm",
    unread: false,
    avatar: "",
    isAdmin: true
  }
]

const filterTabs = [
  { id: "all", label: "All", active: true },
  { id: "unread", label: "Unread", active: false },
  { id: "favorites", label: "Favorites", active: false },
  { id: "groups", label: "Groups", active: false }
]

export function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {
  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">Chats</h1>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
            Duel Now!
          </Button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-zinc-800 rounded-lg p-1">
          {filterTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={tab.active ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-1 text-xs",
                tab.active 
                  ? "bg-zinc-700 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-zinc-700"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatData.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.name)}
            className={cn(
              "flex items-center p-4 cursor-pointer hover:bg-zinc-800 border-b border-zinc-800/50",
              selectedChat === chat.name ? "bg-zinc-800" : ""
            )}
          >
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback className="bg-zinc-700 text-white">
                {chat.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white truncate">
                  {chat.name}
                  {chat.isAdmin && (
                    <span className="ml-1 text-xs text-gray-400">Admin</span>
                  )}
                </h3>
                <span className="text-xs text-gray-400 ml-2">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
            </div>
            
            {chat.unread && (
              <div className="w-2 h-2 bg-amber-500 rounded-full ml-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Gift className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
