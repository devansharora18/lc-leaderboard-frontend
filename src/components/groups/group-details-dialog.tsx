"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Users, Trophy } from "lucide-react"
import { groupsService } from "@/services"
import { dashboardService } from "@/services/dashboard.service"
import type { Group, GroupMember } from "@/types/groups"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface GroupDetailsDialogProps {
  groupId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupDetailsDialog({ groupId, open, onOpenChange }: GroupDetailsDialogProps) {
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dashMap, setDashMap] = useState<Record<string, { totalSolved: number; streak: number }>>({})

  const leaderboard = useMemo(() => {
    if (!members || members.length === 0) return [] as Array<{
      rank: number;
      username: string;
      solved: number;
      streak: number;
      xp: number;
    }>;

    const enriched = members.map((m) => {
      const username = m.user.username || ''
      const key = username.toLowerCase()
      const entry = dashMap[key]
      return {
        username,
        solved: entry?.totalSolved ?? 0,
        streak: entry?.streak ?? 0,
        xp: typeof m.xp === 'number' ? m.xp : 0,
      }
    })

    const sorted = enriched.sort((a, b) => {
      if (b.solved !== a.solved) return b.solved - a.solved
      if (b.streak !== a.streak) return b.streak - a.streak
      return b.xp - a.xp
    })

    return sorted.map((row, idx) => ({
      rank: idx + 1,
      ...row,
    }))
  }, [members, dashMap])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!groupId || !open) return
      setLoading(true)
      setError(null)
      try {
        const [g, m, dash] = await Promise.all([
          groupsService.getGroupDetails(groupId),
          groupsService.getGroupMembers(groupId),
          dashboardService.getLeaderboard().catch(() => null),
        ])
        if (!cancelled) {
          setGroup(g.data)
          setMembers(m.data)
          if (dash && dash.success) {
            const map: Record<string, { totalSolved: number; streak: number }> = {}
            for (const u of dash.data.leaderboard) {
              map[u.username.toLowerCase()] = { totalSolved: u.totalSolved, streak: u.streak }
            }
            setDashMap(map)
          } else {
            setDashMap({})
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load group")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [groupId, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            {group?.name || "Group"}
          </DialogTitle>
          {group?.description && (
            <DialogDescription className="text-gray-400">
              {group.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {loading && (
          <div className="text-gray-400">Loading…</div>
        )}
        {error && (
          <div className="text-red-400">{error}</div>
        )}
        {group && !loading && !error && (
          <div className="space-y-4">
            <div className="text-sm text-gray-300">
              <div><span className="text-gray-400">Created:</span> {new Date(group.createdAt).toLocaleString()}</div>
              <div><span className="text-gray-400">Members:</span> {group.members?.length ?? 0}</div>
              <div><span className="text-gray-400">Privacy:</span> {group.isPrivate ? "Private" : "Public"}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Recent Members</div>
              <ul className="max-h-40 overflow-auto divide-y divide-zinc-800 rounded-md border border-zinc-800">
                {(members || []).slice(0, 10).map(m => (
                  <li key={m.id} className="flex items-center justify-between p-2 text-sm">
                    <span className="truncate">{m.user.username}</span>
                    <span className="text-xs text-gray-500">{m.role}</span>
                  </li>
                ))}
                {(!members || members.length === 0) && (
                  <li className="p-2 text-sm text-gray-500">No members</li>
                )}
              </ul>
            </div>

            {/* Group Leaderboard */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">Group Leaderboard</span>
              </div>
              <ul className="max-h-64 overflow-auto divide-y divide-zinc-800 rounded-md border border-zinc-800">
                {leaderboard.slice(0, 10).map(row => (
                  <li key={row.rank} className="flex items-center justify-between p-2 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-gray-400 tabular-nums">{row.rank}</span>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-zinc-700 text-white text-[10px]">
                          {row.username.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{row.username}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-300">
                      <span className="text-amber-400 font-medium">Solved: {row.solved}</span>
                      <span className="text-gray-400">Streak: {row.streak}</span>
                    </div>
                  </li>
                ))}
                {leaderboard.length === 0 && (
                  <li className="p-2 text-sm text-gray-500">No leaderboard yet</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
