import { apiClient } from './api.client';
import {
  GroupsResponse,
  GroupDetailsResponse,
  GroupMembersResponse,
  MyGroupsResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  UpdateMemberRoleRequest,
  TransferOwnershipRequest,
  GroupsSearchParams,
  ApiResponse,
} from '@/types/groups';

class GroupsService {
  /**
   * Fetch groups with pagination and search
   */
  async getGroups(params: GroupsSearchParams = {}): Promise<GroupsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/groups?${queryString}` : '/groups';

    return apiClient.get<GroupsResponse>(endpoint);
  }

  /**
   * Get detailed information about a specific group
   */
  async getGroupDetails(groupId: string): Promise<GroupDetailsResponse> {
    return apiClient.get<GroupDetailsResponse>(`/groups/${groupId}`);
  }

  /**
   * Get all members of a specific group
   */
  async getGroupMembers(groupId: string): Promise<GroupMembersResponse> {
    return apiClient.get<GroupMembersResponse>(`/groups/${groupId}/members`);
  }

  /**
   * Get groups that the current user is a member of
   */
  async getMyGroups(): Promise<MyGroupsResponse> {
    return apiClient.get<MyGroupsResponse>('/groups/user/my-groups', true);
  }

  /**
   * Create a new group
   */
  async createGroup(groupData: CreateGroupRequest): Promise<GroupDetailsResponse> {
    return apiClient.post<GroupDetailsResponse>('/groups', groupData, true);
  }

  /**
   * Update an existing group
   */
  async updateGroup(groupId: string, groupData: UpdateGroupRequest): Promise<GroupDetailsResponse> {
    return apiClient.put<GroupDetailsResponse>(`/groups/${groupId}`, groupData, true);
  }

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/groups/${groupId}`, true);
  }

  /**
   * Join a group
   */
  async joinGroup(groupId: string): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>(`/groups/${groupId}/join`, undefined, true);
  }

  /**
   * Leave a group
   */
  async leaveGroup(groupId: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/groups/${groupId}/leave`, true);
  }

  /**
   * Remove a member from a group
   */
  async removeMember(groupId: string, userId: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/groups/${groupId}/members/${userId}`, true);
  }

  /**
   * Update a member's role in a group
   */
  async updateMemberRole(
    groupId: string, 
    userId: string, 
    roleData: UpdateMemberRoleRequest
  ): Promise<ApiResponse<null>> {
    return apiClient.put<ApiResponse<null>>(`/groups/${groupId}/members/${userId}/role`, roleData, true);
  }

  /**
   * Transfer ownership of a group to another member
   */
  async transferOwnership(
    groupId: string, 
    transferData: TransferOwnershipRequest
  ): Promise<ApiResponse<null>> {
    return apiClient.put<ApiResponse<null>>(`/groups/${groupId}/transfer-ownership`, transferData, true);
  }
}

export const groupsService = new GroupsService();
