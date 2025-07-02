import { apiClient } from './api.client';
import { LeaderboardResponse } from '../types/leaderboard';
import { UserProfileResponse } from '../types/user';

class UserService {
  async getLeaderboard(): Promise<LeaderboardResponse> {
    return apiClient.get<LeaderboardResponse>('/user/leaderboard', true);
  }

  async getProfile(): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>('/user/profile', true);
  }
}

export const userService = new UserService();
