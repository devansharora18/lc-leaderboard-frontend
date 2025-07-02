export interface User {
  id: string;
  username: string;
  email: string;
  leetcodeHandle: string;
  leetcodeVerified: boolean;
  streak: number;
  lastSolvedAt: string | null;
  groups: string[];
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: User;
}
