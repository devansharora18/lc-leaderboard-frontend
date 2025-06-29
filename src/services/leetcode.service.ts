import { apiClient } from './api.client';

export interface LeetCodeConnectRequest {
  leetcodeUsername: string;
}

export interface LeetCodeConnectResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    verificationCode: string;
    leetcodeUsername: string;
    instructions: string;
    timeoutInSeconds: number;
    pollIntervalInSeconds: number;
  };
}

export interface LeetCodeStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    isVerified: boolean;
    isInProgress: boolean;
    leetcodeHandle: string;
  };
}

class LeetCodeService {
  async connectLeetCode(leetcodeUsername: string): Promise<LeetCodeConnectResponse> {
    return apiClient.post<LeetCodeConnectResponse>(
      '/leetcode/connect',
      { leetcodeUsername },
      true // requireAuth
    );
  }

  async getVerificationStatus(): Promise<LeetCodeStatusResponse> {
    return apiClient.get<LeetCodeStatusResponse>(
      '/leetcode/status',
      true // requireAuth
    );
  }
}

export const leetcodeService = new LeetCodeService();
