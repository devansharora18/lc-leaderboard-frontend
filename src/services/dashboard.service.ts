import { apiClient } from './api.client';

interface DashboardLeaderboardUser {
  username: string;
  streak: number;
  totalSolved: number;
}

interface DashboardLeaderboardResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    leaderboard: DashboardLeaderboardUser[];
    count: number;
  };
}

class DashboardService {
  async getLeaderboard(): Promise<DashboardLeaderboardResponse> {
    return apiClient.get<DashboardLeaderboardResponse>('/dashboard/leaderboard', true);
  }
}

export const dashboardService = new DashboardService();
