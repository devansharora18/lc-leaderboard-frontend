import { useState, useEffect, useCallback, useRef } from 'react';
import { groupsService } from '@/services';
import { 
  Group, 
  MyGroup,
  GroupsResponse, 
  GroupMembersResponse,
  GroupsSearchParams,
  CreateGroupRequest,
  UpdateGroupRequest,
  UpdateMemberRoleRequest,
  TransferOwnershipRequest,
} from '@/types/groups';

/**
 * Hook to fetch and manage groups with search and pagination
 */
export const useGroups = (initialParams?: GroupsSearchParams) => {
  const [params, setParams] = useState<GroupsSearchParams>(initialParams || {});
  const paramsRef = useRef(params);
  const [groups, setGroups] = useState<Group[]>([]);
  const [pagination, setPagination] = useState<GroupsResponse['data']['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep ref in sync with state only when needed
  useEffect(() => {
    // Only update ref if it's actually different to avoid unnecessary updates
    if (JSON.stringify(paramsRef.current) !== JSON.stringify(params)) {
      paramsRef.current = params;
    }
  }, [params]);

  const fetchGroups = useCallback(async (searchParams: GroupsSearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.getGroups(searchParams);
      setGroups(response.data.groups);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback((newParams?: GroupsSearchParams) => {
    const finalParams = newParams || paramsRef.current;
    if (newParams) {
      // Update params without causing re-renders
      paramsRef.current = finalParams;
      setParams(finalParams);
    }
    fetchGroups(finalParams);
  }, [fetchGroups]);

  // Only run on mount if initialParams are provided
  useEffect(() => {
    if (initialParams) {
      fetchGroups(initialParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Only run once on mount

  return {
    groups,
    pagination,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch and manage detailed group information
 */
export const useGroupDetails = (groupId: string) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.getGroupDetails(groupId);
      setGroup(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);  // Only re-run when groupId changes

  return {
    group,
    loading,
    error,
    refetch: fetchGroupDetails,
  };
};

/**
 * Hook to fetch and manage group members
 */
export const useGroupMembers = (groupId: string) => {
  const [members, setMembers] = useState<GroupMembersResponse['data']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.getGroupMembers(groupId);
      setMembers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch group members');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);  // Only re-run when groupId changes

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
  };
};

/**
 * Hook to fetch and manage user's groups
 */
export const useMyGroups = () => {
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.getMyGroups();
      setMyGroups(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch your groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Only run once on mount

  return {
    myGroups,
    loading,
    error,
    refetch: fetchMyGroups,
  };
};

/**
 * Hook for creating a new group
 */
export const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGroup = useCallback(async (groupData: CreateGroupRequest): Promise<Group | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.createGroup(groupData);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createGroup,
    loading,
    error,
  };
};

/**
 * Hook for updating a group
 */
export const useUpdateGroup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGroup = useCallback(async (groupId: string, groupData: UpdateGroupRequest): Promise<Group | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.updateGroup(groupId, groupData);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update group');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateGroup,
    loading,
    error,
  };
};

/**
 * Hook for group membership actions (join, leave, delete)
 */
export const useGroupActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinGroup = useCallback(async (groupId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await groupsService.joinGroup(groupId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveGroup = useCallback(async (groupId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await groupsService.leaveGroup(groupId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave group');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGroup = useCallback(async (groupId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await groupsService.deleteGroup(groupId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    joinGroup,
    leaveGroup,
    deleteGroup,
    loading,
    error,
  };
};

/**
 * Hook for group management actions (remove member, update role, transfer ownership)
 */
export const useGroupManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = useCallback(async (groupId: string, userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await groupsService.removeMember(groupId, userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMemberRole = useCallback(async (
    groupId: string, 
    userId: string, 
    roleData: UpdateMemberRoleRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await groupsService.updateMemberRole(groupId, userId, roleData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member role');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const transferOwnership = useCallback(async (
    groupId: string, 
    transferData: TransferOwnershipRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await groupsService.transferOwnership(groupId, transferData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer ownership');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    removeMember,
    updateMemberRole,
    transferOwnership,
    loading,
    error,
  };
};
