'use client';

import { useLeaderboard } from '../../hooks';
import { RefreshCw } from 'lucide-react';
import { LeaderboardSkeleton } from './leaderboard-skeleton';
import { formatRelativeTime } from '../../lib/date-utils';

export function Leaderboard() {
  const { leaderboard, isLoading, error, refetch } = useLeaderboard();

  const handleRefresh = () => {
    refetch();
  };

  // Show skeleton on initial load
  if (isLoading && leaderboard.length === 0) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-md px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading leaderboard...
          </div>
        </div>
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
      ) : leaderboard.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-gray-400">No users found</div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase text-gray-400">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Current Streak</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
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
                      <div className="text-xs text-gray-400">@{user.leetcodeHandle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-500">{user.streak}</span>
                    <span className="text-xs text-gray-400">days</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {user.leetcodeVerified ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-green-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-red-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-xs text-gray-400">
                      {user.leetcodeVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-400">
                    {formatRelativeTime(user.lastSolvedAt)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
