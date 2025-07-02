import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { LeaderboardEntry, LeaderboardUser } from '../types/leaderboard';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userService.getLeaderboard();
      
      if (response.success) {
        // Transform users to leaderboard entries with ranking
        const sortedUsers = response.data.users
          .sort((a, b) => {
            // Primary sort: streak descending
            if (b.streak !== a.streak) {
              return b.streak - a.streak;
            }
            // Secondary sort: username ascending for consistency
            return a.username.localeCompare(b.username);
          })
          .map((user: LeaderboardUser, index: number) => ({
            ...user,
            rank: index + 1,
          }));
        
        setLeaderboard(sortedUsers);
      } else {
        setError(response.message || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    isLoading,
    error,
    refetch: fetchLeaderboard,
  };
};
