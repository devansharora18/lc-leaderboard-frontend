"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  Users, 
  Plus,
  Search,
  Globe
} from "lucide-react"
import { useMyGroups } from "@/hooks"
import { CreateGroupDialog } from "@/components/groups/create-group-dialog"
import { GroupDetailsDialog } from "@/components/groups/group-details-dialog"

interface ChatSidebarProps {
  selectedChat: string | null
  onSelectChat: (chatId: string, type: 'user' | 'group', name?: string) => void
  onShowDiscoverGroups: () => void
}

interface DisplayItem {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: boolean
  avatar: string
  isAdmin?: boolean
  isGroup?: boolean
}

const filterTabs = [
  { id: "all", label: "All" },
  { id: "groups", label: "My Groups" }
]

export function ChatSidebar({ selectedChat, onSelectChat, onShowDiscoverGroups }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState("groups")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { myGroups, loading: groupsLoading, error: groupsError, refetch } = useMyGroups()
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [groupDialogId, setGroupDialogId] = useState<string | null>(null)

  const getDisplayData = (): DisplayItem[] => {
    const groupItems: DisplayItem[] = myGroups.map(group => ({
      id: group.id,
      name: group.name,
      lastMessage: `${group.memberCount || group._count?.members || 0} members • Last activity: ${new Date(group.updatedAt).toLocaleDateString()}`,
      time: new Date(group.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: false,
      avatar: "",
      isGroup: true
    }))

    let data: DisplayItem[] = []
    
    // With backend integration, we show only groups for now
    data = groupItems

    // Filter by search query
    if (searchQuery.trim()) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return data
  }

  const displayData = getDisplayData()

  const handleGroupCreated = () => {
    setShowCreateDialog(false)
    refetch()
  }

  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">My Groups</h1>
          {activeTab === "groups" ? (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={onShowDiscoverGroups}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              >
                <Globe className="h-4 w-4 mr-1" />
                Discover
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          ) : (
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
              Duel Now!
            </Button>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={activeTab === "groups" ? "Search groups..." : "Search chats..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
          />
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-zinc-800 rounded-lg p-1">
          {filterTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 text-xs",
                activeTab === tab.id 
                  ? "bg-zinc-700 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-zinc-700"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat/Group List */}
      <div className="flex-1 overflow-y-auto">
        {groupsLoading && activeTab === "groups" && (
          <div className="p-4 text-center text-gray-400">Loading groups...</div>
        )}
        
        {groupsError && activeTab === "groups" && (
          <div className="p-4 text-center text-red-400">Failed to load groups</div>
        )}

        {displayData.length === 0 && !groupsLoading && (
          <div className="p-4 text-center text-gray-400">
            {searchQuery ? (
              <div>
                <p className="mb-2">No results found</p>
                <p className="text-sm text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <div>
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="mb-2">No groups yet</p>
                <p className="text-sm text-gray-500 mb-4">Create or discover groups to get started</p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onShowDiscoverGroups}
                    className="border-zinc-600"
                  >
                    Discover Groups
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Group
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {displayData.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectChat(
              item.isGroup ? `group-${item.id}` : item.id, 
              item.isGroup ? 'group' : 'user',
              item.name
            )}
            className={cn(
              "flex items-center p-4 cursor-pointer hover:bg-zinc-800 border-b border-zinc-800/50",
              selectedChat === (item.isGroup ? `group-${item.id}` : item.id) ? "bg-zinc-800" : ""
            )}
          >
            <Avatar 
              className="h-12 w-12 mr-3"
              onClick={(e) => {
                if (item.isGroup) {
                  e.stopPropagation()
                  setGroupDialogId(item.id)
                  setGroupDialogOpen(true)
                }
              }}
              data-testid={item.isGroup ? `group-avatar-${item.id}` : undefined}
            >
              <AvatarFallback className={cn(
                "text-white",
                item.isGroup ? "bg-blue-600" : "bg-zinc-700"
              )}>
                {item.isGroup ? (
                  <Users className="h-6 w-6" />
                ) : (
                  item.name.split(' ').map(n => n[0]).join('')
                )}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white truncate">
                  {item.name}
                  {item.isAdmin && (
                    <span className="ml-1 text-xs text-gray-400">Admin</span>
                  )}
                  {item.isGroup && (
                    <span className="ml-1 text-xs text-blue-400">Group</span>
                  )}
                </h3>
                <span className="text-xs text-gray-400 ml-2">{item.time}</span>
              </div>
              <p className="text-sm text-gray-400 truncate">{item.lastMessage}</p>
            </div>
            
            {item.unread && (
              <div className="w-2 h-2 bg-amber-500 rounded-full ml-2"></div>
            )}
          </div>
        ))}
      </div>


      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onGroupCreated={handleGroupCreated}
      />

      {/* Group Details Popup */}
      <GroupDetailsDialog
        groupId={groupDialogId}
        open={groupDialogOpen}
        onOpenChange={(open) => {
          setGroupDialogOpen(open)
          if (!open) setGroupDialogId(null)
        }}
      />
    </div>
  )
}
