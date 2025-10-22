"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatArea } from "./chat-area"
import { ProfilePanel } from "./profile-panel"
import { GroupDiscovery } from "@/components/groups/group-discovery"
import { Sidebar } from "@/components/dashboard/sidebar"

type ViewType = 'chat' | 'discover'

interface ChatData {
  id: string
  name: string
  type: 'user' | 'group'
}

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('chat')
  const [showProfile, setShowProfile] = useState(false)
  const [chatData, setChatData] = useState<Record<string, ChatData>>({})

  const handleSelectChat = (chatId: string, type: 'user' | 'group', name?: string) => {
    setSelectedChat(chatId)
    setCurrentView('chat')
    
    // Store chat data
    setChatData(prev => ({
      ...prev,
      [chatId]: {
        id: chatId,
        name: name || (type === 'group' && chatId.startsWith('group-') ? 
          chatId.replace('group-', '') : chatId),
        type
      }
    }))
    
    console.log('Selected chat type:', type)
  }

  const handleShowDiscoverGroups = () => {
    setCurrentView('discover')
  }

  const handleShowProfile = () => {
    setShowProfile(true)
  }

  const handleBackToChat = () => {
    setCurrentView('chat')
    setShowProfile(false)
  }

  const handleGroupJoined = (groupId: string, groupName?: string) => {
    // Create the group chat ID that matches what the sidebar uses
    const groupChatId = `group-${groupId}`
    
    // Store the group data with proper name
    setChatData(prev => ({
      ...prev,
      [groupChatId]: {
        id: groupChatId,
        name: groupName || `Group ${groupId}`,
        type: 'group'
      }
    }))
    
    // Switch to the joined group
    setSelectedChat(groupChatId)
    setCurrentView('chat')
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'discover':
        return (
          <GroupDiscovery 
            onBack={handleBackToChat}
            onGroupJoined={handleGroupJoined}
          />
        )
      default:
        return (
          <>
            <ChatArea 
              selectedChat={selectedChat}
              chatName={selectedChat ? (chatData[selectedChat]?.name || selectedChat) : null}
              chatType={selectedChat ? (chatData[selectedChat]?.type || 'user') : 'user'}
              onShowProfile={handleShowProfile}
            />
            {showProfile && (
              <div className="w-80 shrink-0">
                <ProfilePanel 
                  onClose={() => setShowProfile(false)}
                />
              </div>
            )}
          </>
        )
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main App Sidebar */}
      <Sidebar />
      
      {/* Chat Sidebar */}
      <ChatSidebar 
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onShowDiscoverGroups={handleShowDiscoverGroups}
        onShowProfile={handleShowProfile}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {renderMainContent()}
      </div>
    </div>
  )
}
