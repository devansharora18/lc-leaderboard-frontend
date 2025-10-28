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

interface DashboardSubmissionsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    submissions: any[];
    count: number;
    limit: number;
  };
}

interface DailyQuestionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    dailyQuestion: any;
  };
}

class DashboardService {
  async getLeaderboard(): Promise<DashboardLeaderboardResponse> {
    return apiClient.get<DashboardLeaderboardResponse>('/dashboard/leaderboard', true);
  }

  async getSubmissions(limit = 10): Promise<DashboardSubmissionsResponse> {
    const query = new URLSearchParams({ limit: String(limit) }).toString();
    return apiClient.get<DashboardSubmissionsResponse>(`/dashboard/submissions?${query}`, true);
  }

  async getDailyQuestion(): Promise<DailyQuestionResponse> {
    return apiClient.get<DailyQuestionResponse>('/dashboard/daily', false);
  }
}

export const dashboardService = new DashboardService();
