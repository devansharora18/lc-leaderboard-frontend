import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/leaderboard';
import { dashboardService } from '../services/dashboard.service';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await dashboardService.getLeaderboard();
      
      if (response.success) {
        const entries: LeaderboardEntry[] = response.data.leaderboard.map((u, index) => ({
          id: u.username,
          username: u.username,
          email: '',
          leetcodeHandle: '',
          leetcodeVerified: true,
          streak: u.streak,
          lastSolvedAt: null,
          totalSolved: u.totalSolved,
          rank: index + 1,
        }));

        setLeaderboard(entries);
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
