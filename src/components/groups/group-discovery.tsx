"use client"

import { useState, useEffect } from 'react'
import { useGroups, useGroupActions } from '@/hooks'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Search, 
  Users, 
  Lock, 
  Unlock,
  UserCheck,
  Crown,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'

interface GroupDiscoveryProps {
  onBack: () => void
  onGroupJoined: (groupId: string, groupName: string) => void
}

export function GroupDiscovery({ onBack, onGroupJoined }: GroupDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasInitialized, setHasInitialized] = useState(false)
  
  const { groups, pagination, loading, error, refetch } = useGroups()
  
  const { joinGroup, loading: actionLoading } = useGroupActions()

  // Fetch groups when component mounts
  useEffect(() => {
    if (!hasInitialized) {
      refetch({
        page: 1,
        limit: 6,
        search: ''
      })
      setHasInitialized(true)
    }
  }, [hasInitialized, refetch])

  // Handle search with debouncing to avoid too many requests
  useEffect(() => {
    if (hasInitialized) {
      const timeoutId = setTimeout(() => {
        refetch({
          page: 1,
          limit: 6,
          search: searchQuery
        })
        setCurrentPage(1)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, hasInitialized, refetch])

  // Handle page changes
  useEffect(() => {
    if (hasInitialized && currentPage > 1) {
      refetch({
        page: currentPage,
        limit: 6,
        search: searchQuery
      })
    }
  }, [currentPage, hasInitialized, refetch, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // The useEffect will handle the refetch with debouncing
  }

  const handleJoinGroup = async (groupId: string, groupName: string) => {
    const success = await joinGroup(groupId)
    if (success) {
      onGroupJoined(groupId, groupName)
      // Trigger a refresh to update the groups list
      setCurrentPage(1)  // This will trigger the useEffect to refetch
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // The useEffect will handle the refetch
  }

  const handleRefresh = () => {
    // Simply trigger a fresh fetch with current params
    refetch({
      page: currentPage,
      limit: 6,
      search: searchQuery
    })
  }

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-semibold text-white">Discover Groups</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="text-gray-400 hover:text-white ml-auto"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search groups by name or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-zinc-700 rounded mb-2"></div>
                <div className="h-3 bg-zinc-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        )}

        {/* Groups List */}
        {!loading && !error && (
          <>
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No groups found</p>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'Try a different search term' : 'No public groups available at the moment'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
                  >
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {group.name}
                          </h3>
                          {group.isPrivate ? (
                            <Lock className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-500" />
                          )}
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
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    {/* Group Stats */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {group.members.length}/{group.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-zinc-700 text-xs">
                            {group.creator.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-400">
                          by {group.creator.username}
                        </span>
                        <Crown className="h-3 w-3 text-amber-500" />
                      </div>
                    </div>

                    {/* Members Preview */}
                    {group.members.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex -space-x-1">
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
                        <span className="text-xs text-gray-500">members</span>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => handleJoinGroup(group.id, group.name)}
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
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="border-zinc-700"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="border-zinc-700"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
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
    </div>
  )
}
