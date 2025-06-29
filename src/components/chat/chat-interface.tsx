"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatArea } from "./chat-area"
import { ProfilePanel } from "./profile-panel"
import { Sidebar } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>("Penny Valeria")
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main App Sidebar */}
      <Sidebar />
      
      {/* Chat Sidebar */}
      <ChatSidebar 
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      
      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex transition-all duration-300",
        showProfile ? "mr-80" : ""
      )}>
        <ChatArea 
          selectedChat={selectedChat}
          onShowProfile={() => setShowProfile(!showProfile)}
        />
      </div>
      
      {/* Profile Panel */}
      {showProfile && (
        <ProfilePanel 
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}
