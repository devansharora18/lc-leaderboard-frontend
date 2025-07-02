export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  xp: number;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    leetcodeHandle: string;
    leetcodeVerified: boolean;
    streak: number;
    lastSolvedAt: string | null;
  };
}

export interface GroupCreator {
  id: string;
  username: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  maxMembers: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  creator: GroupCreator;
}

export interface MyGroup {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  maxMembers: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    username: string;
  };
  _count: {
    members: number;
  };
  memberCount: number;
  userRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
  xp: number;
}

export interface GroupsPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GroupsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    groups: Group[];
    pagination: GroupsPagination;
  };
}

export interface GroupDetailsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: Group;
}

export interface GroupMembersResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: GroupMember[];
}

export interface MyGroupsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: MyGroup[];
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  isPrivate: boolean;
  maxMembers: number;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  maxMembers?: number;
}

export interface UpdateMemberRoleRequest {
  role: 'ADMIN' | 'MEMBER';
}

export interface TransferOwnershipRequest {
  newOwnerId: string;
}

export interface GroupsSearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export interface EmptyResponse {
  [key: string]: never;
}
