"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGroupDetails, useGroupMembers, useGroupActions, useGroupManagement } from '@/hooks'
import { dashboardService } from '@/services/dashboard.service'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  ArrowLeft,
  Users, 
  Lock, 
  Unlock,
  UserCheck,
  UserMinus,
  Crown,
  Shield,
  Calendar,
  Settings,
  MessageCircle,
  Trophy
} from 'lucide-react'

export default function GroupDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string
  
  const { group, loading, error, refetch } = useGroupDetails(groupId)
  const { members, loading: membersLoading } = useGroupMembers(groupId)
  const { joinGroup, leaveGroup, loading: actionLoading } = useGroupActions()
  const { removeMember, updateMemberRole, loading: managementLoading } = useGroupManagement()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'leaderboard'>('overview')
  const [dashMap, setDashMap] = useState<Record<string, { totalSolved: number; streak: number }>>({})

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await dashboardService.getLeaderboard()
        if (!cancelled && res && res.success) {
          const map: Record<string, { totalSolved: number; streak: number }> = {}
          for (const u of res.data.leaderboard) {
            map[u.username.toLowerCase()] = { totalSolved: u.totalSolved, streak: u.streak }
          }
          setDashMap(map)
        }
      } catch {
        // ignore; fallback to member fields/xp
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
  <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-zinc-700 rounded w-3/4 mb-8"></div>
            <div className="h-32 bg-zinc-700 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-zinc-700 rounded"></div>
              <div className="h-40 bg-zinc-700 rounded"></div>
              <div className="h-40 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
  <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error || 'Group not found'}</p>
            <Button onClick={() => router.push('/groups')}>
              Back to Groups
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleJoinGroup = async () => {
    const success = await joinGroup(group.id)
    if (success) {
      refetch()
    }
  }

  const handleLeaveGroup = async () => {
    const success = await leaveGroup(group.id)
    if (success) {
      router.push('/groups')
    }
  }

  const handleRemoveMember = async (userId: string) => {
    const success = await removeMember(group.id, userId)
    if (success) {
      refetch()
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: 'ADMIN' | 'MEMBER') => {
    const success = await updateMemberRole(group.id, userId, { role: newRole })
    if (success) {
      refetch()
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4 text-amber-500" />
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <Users className="h-4 w-4 text-gray-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Badge className="bg-amber-500/20 text-amber-300">Owner</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-500/20 text-blue-300">Admin</Badge>
      default:
        return <Badge variant="secondary">Member</Badge>
    }
  }

  const currentUserMember = members.find(m => m.userId === 'current-user-id') // Replace with actual current user ID
  const isOwner = currentUserMember?.role === 'OWNER'
  const isAdmin = currentUserMember?.role === 'ADMIN' || isOwner
  const isMember = !!currentUserMember

  return (
  <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/groups')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </div>

        {/* Group Info Card */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{group.name}</h1>
                {group.isPrivate ? (
                  <Lock className="h-6 w-6 text-amber-500" />
                ) : (
                  <Unlock className="h-6 w-6 text-green-500" />
                )}
                <Badge 
                  variant="secondary" 
                  className={cn(
                    group.isPrivate ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300"
                  )}
                >
                  {group.isPrivate ? "Private" : "Public"}
                </Badge>
              </div>
              
              <p className="text-gray-300 mb-4">{group.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{group.members.length}/{group.maxMembers} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span>Owner: {group.creator.username}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {!isMember ? (
                <Button
                  onClick={handleJoinGroup}
                  disabled={actionLoading || group.members.length >= group.maxMembers}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {actionLoading ? "Joining..." : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Join Group
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-zinc-600"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  {!isOwner && (
                    <Button
                      variant="outline"
                      onClick={handleLeaveGroup}
                      disabled={actionLoading}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      {actionLoading ? "Leaving..." : (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Leave
                        </>
                      )}
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="border-zinc-600"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-zinc-800 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as 'overview' | 'members' | 'leaderboard')}
              className={cn(
                "flex-1 flex items-center gap-2",
                activeTab === tab.id 
                  ? "bg-zinc-700 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-zinc-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
              <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Group Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Members</span>
                  <span className="text-white">{group.members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Members</span>
                  <span className="text-white">{group.members.filter(m => m.xp > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total XP</span>
                  <span className="text-white">{group.members.reduce((sum, m) => sum + m.xp, 0)}</span>
                </div>
              </div>
            </div>

              <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3 text-gray-400">
                <p className="text-sm">No recent activity</p>
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {group.members
                  .sort((a, b) => b.xp - a.xp)
                  .slice(0, 3)
                  .map((member, index) => (
            <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                      <span className="text-amber-500 font-bold">#{index + 1}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-zinc-700 text-xs">
                          {member.user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white text-sm">{member.user.username}</p>
                        <p className="text-gray-400 text-xs">{member.xp} XP</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg">
            <div className="p-6 border-b border-zinc-700">
              <h3 className="text-lg font-semibold text-white">
                Members ({members.length})
              </h3>
            </div>
            <div className="divide-y divide-zinc-700">
              {membersLoading ? (
                <div className="p-6 text-center text-gray-400">Loading members...</div>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-zinc-700">
                          {member.user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{member.user.username}</h4>
                          {getRoleIcon(member.role)}
                          {getRoleBadge(member.role)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{member.xp} XP</span>
                          <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                          {member.user.leetcodeVerified && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                              LeetCode Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {isAdmin && member.role !== 'OWNER' && member.userId !== currentUserMember?.userId && (
                      <div className="flex items-center gap-2">
                        {member.role === 'MEMBER' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRoleUpdate(member.userId, 'ADMIN')}
                            disabled={managementLoading}
                            className="border-zinc-600"
                          >
                            Make Admin
                          </Button>
                        )}
                        {member.role === 'ADMIN' && isOwner && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRoleUpdate(member.userId, 'MEMBER')}
                            disabled={managementLoading}
                            className="border-zinc-600"
                          >
                            Remove Admin
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={managementLoading}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg">
            <div className="p-6 border-b border-zinc-700">
              <h3 className="text-lg font-semibold text-white">Group Leaderboard</h3>
            </div>
            <div className="divide-y divide-zinc-700">
              {members
                .map((m) => {
                  const uname = (m.user.username || '').toLowerCase()
                  const entry = dashMap[uname]
                  const solved = entry?.totalSolved ?? 0
                  const streak = entry?.streak ?? 0
                  return { m, solved, streak }
                })
                .sort((a, b) => {
                  if (b.solved !== a.solved) return b.solved - a.solved
                  if (b.streak !== a.streak) return b.streak - a.streak
                  return a.m.user.username.localeCompare(b.m.user.username)
                })
                .map(({ m: member, solved, streak }, index) => (
                  <div key={member.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                        index === 0 ? "bg-amber-500 text-black" :
                        index === 1 ? "bg-gray-400 text-black" :
                        index === 2 ? "bg-amber-600 text-white" :
                        "bg-zinc-700 text-gray-300"
                      )}>
                        {index + 1}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-zinc-700">
                          {member.user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{member.user.username}</h4>
                          {getRoleIcon(member.role)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Streak: {streak} days</span>
                          {member.user.lastSolvedAt && (
                            <span>Last solved: {new Date(member.user.lastSolvedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{solved}</div>
                      <div className="text-sm text-gray-400">Solved</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
