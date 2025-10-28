"use client";

import { useMemo, useState } from 'react'
import { useLeaderboard } from '../../hooks'
import { RefreshCw, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { LeaderboardSkeleton } from './leaderboard-skeleton'
import { formatRelativeTime } from '../../lib/date-utils'
import { Input } from '@/components/ui/input'

export function Leaderboard() {
  const { leaderboard, isLoading, error, refetch } = useLeaderboard();
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const handleRefresh = () => {
    refetch();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return leaderboard
    return leaderboard.filter(u =>
      u.username.toLowerCase().includes(q)
    )
  }, [leaderboard, search])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * limit
  const end = start + limit
  const pageSlice = filtered.slice(start, end)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Header with refresh button */}
      <div className="flex flex-col gap-3 border-b border-zinc-800 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search users or handles..."
              className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        leaderboard.length === 0 ? (
          <LeaderboardSkeleton />
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading leaderboard...
            </div>
          </div>
        )
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 gap-2">
          <div className="text-sm text-red-400">Error: {error}</div>
          <button
            onClick={handleRefresh}
            className="text-xs text-gray-400 hover:text-white underline"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-gray-400">No users found</div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase text-gray-400">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Solved</th>
              <th className="px-4 py-3">Current Streak</th>
            </tr>
          </thead>
          <tbody>
            {pageSlice.map((user) => (
              <tr key={user.id} className="border-b border-zinc-800 text-sm last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.rank}</span>
                    {user.rank === 1 && (
                      <span className="text-yellow-500">👑</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="mr-2 h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      {user.leetcodeHandle && (
                        <div className="text-xs text-gray-400">@{user.leetcodeHandle}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-400">{typeof user.totalSolved === 'number' ? user.totalSolved : '-'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-500">{user.streak}</span>
                    <span className="text-xs text-gray-400">days</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination footer */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="flex flex-col items-center gap-3 border-t border-zinc-800 px-4 py-3 text-sm text-gray-300 md:flex-row md:justify-between">
          <div>
            Showing <span className="text-white">{total === 0 ? 0 : start + 1}</span>–
            <span className="text-white">{Math.min(end, total)}</span> of <span className="text-white">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="px-2 text-xs text-gray-400">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}
              className="ml-2 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
