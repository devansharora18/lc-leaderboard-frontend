"use client"

import { useState } from 'react'
import { useGroups, useGroupActions } from '@/hooks'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Search, 
  Plus, 
  Users, 
  Lock, 
  Unlock,
  UserCheck,
  Crown
} from 'lucide-react'
import { CreateGroupDialog } from '@/components/groups/create-group-dialog'

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const { groups, pagination, loading, error, refetch } = useGroups({
    page: currentPage,
    limit: 10,
    search: searchQuery
  })
  
  const { joinGroup, loading: actionLoading } = useGroupActions()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    refetch({ page: 1, limit: 10, search: query })
  }

  const handleJoinGroup = async (groupId: string) => {
    const success = await joinGroup(groupId)
    if (success) {
      refetch({ page: currentPage, limit: 10, search: searchQuery })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    refetch({ page, limit: 10, search: searchQuery })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Groups</h1>
            <p className="text-gray-400">
              Join groups to compete with other developers and share your LeetCode journey
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search groups by name or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-zinc-700 rounded mb-4"></div>
                <div className="h-3 bg-zinc-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => refetch({ page: currentPage, limit: 10, search: searchQuery })}>
              Try Again
            </Button>
          </div>
        )}

        {/* Groups Grid */}
        {!loading && !error && (
          <>
            {groups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No groups found</p>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'Try a different search term' : 'Be the first to create a group!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-colors"
                  >
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {group.name}
                          </h3>
                          {group.isPrivate ? (
                            <Lock className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    {/* Group Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {group.members.length}/{group.maxMembers}
                        </span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          group.isPrivate ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300"
                        )}
                      >
                        {group.isPrivate ? "Private" : "Public"}
                      </Badge>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-zinc-700 text-xs">
                          {group.creator.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-400">
                        Created by {group.creator.username}
                      </span>
                      <Crown className="h-3 w-3 text-amber-500" />
                    </div>

                    {/* Members Preview */}
                    {group.members.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="h-6 w-6 border-2 border-zinc-800">
                              <AvatarFallback className="bg-zinc-700 text-xs">
                                {member.user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {group.members.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-zinc-700 border-2 border-zinc-800 flex items-center justify-center">
                              <span className="text-xs text-gray-300">
                                +{group.members.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={actionLoading || group.members.length >= group.maxMembers}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        "Joining..."
                      ) : group.members.length >= group.maxMembers ? (
                        "Full"
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Join Group
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="border-zinc-700"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                      className="border-zinc-700"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="border-zinc-700"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onGroupCreated={() => {
          setShowCreateDialog(false)
          refetch({ page: currentPage, limit: 10, search: searchQuery })
        }}
      />
    </div>
  )
}
