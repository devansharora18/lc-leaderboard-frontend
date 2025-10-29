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

interface DashboardSubmission {
  title?: string;
  titleSlug?: string;
  timestamp?: number | string;
  time?: string | number;
  submissionTime?: number | string;
  status?: string;
  statusDisplay?: string;
  status_display?: string;
  verdict?: string;
}

interface DashboardSubmissionsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    submissions: DashboardSubmission[];
    count: number;
    limit: number;
  };
}

interface DailyQuestion {
  questionLink?: string;
  date?: string;
  questionTitle?: string;
  title?: string;
  difficulty?: string;
  level?: string;
  titleSlug?: string;
  questionTitleSlug?: string;
  slug?: string;
  link?: string;
  url?: string;
  question?: {
    title?: string;
    questionTitle?: string;
    titleSlug?: string;
    slug?: string;
    difficulty?: string;
    link?: string;
    url?: string;
  };
}

interface DailyQuestionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    dailyQuestion: DailyQuestion;
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
