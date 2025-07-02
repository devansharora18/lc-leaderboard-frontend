export interface LeaderboardUser {
  id: string;
  username: string;
  email: string;
  leetcodeHandle: string;
  leetcodeVerified: boolean;
  streak: number;
  lastSolvedAt: string | null;
}

export interface LeaderboardResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    users: LeaderboardUser[];
  };
}

export interface LeaderboardEntry extends LeaderboardUser {
  rank: number;
}
