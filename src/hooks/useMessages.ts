import { useCallback, useEffect, useMemo, useState } from 'react';
import { messagesService } from '@/services';
import { Message, NormalizedGroupMessagesResponse } from '@/types/message';

interface UseMessagesOptions {
  chatType: 'group' | 'user';
  chatId: string | null;
  page?: number;
  limit?: number;
}

export const useMessages = ({ chatType, chatId, page = 1, limit = 30 }: UseMessagesOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<NormalizedGroupMessagesResponse['pagination']>();

  const normalizedIds = useMemo(() => {
    if (!chatId) return { groupId: null };
    if (chatType === 'group') {
      // Accept both `group-<id>` and `<id>`
      const gid = chatId.startsWith('group-') ? chatId.replace('group-', '') : chatId;
      return { groupId: gid };
    }
    return { groupId: null };
  }, [chatId, chatType]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    setError(null);
    try {
      if (chatType === 'group' && normalizedIds.groupId) {
        const res = await messagesService.getGroupMessages(normalizedIds.groupId, { page, limit });
        setMessages(res.messages || []);
        setPagination(res.pagination);
      } else {
        setMessages([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [chatId, chatType, normalizedIds.groupId, page, limit]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return null;
    if (chatType !== 'group' || !normalizedIds.groupId) return null;
    const newMsg = await messagesService.createMessage(normalizedIds.groupId, { content: content.trim() });
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, [chatType, normalizedIds.groupId]);

  useEffect(() => {
    setMessages([]);
    setPagination(undefined);
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    pagination,
    refetch: fetchMessages,
    sendMessage,
  };
};
