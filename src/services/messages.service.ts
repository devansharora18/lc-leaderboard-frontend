import { apiClient } from './api.client';
import { Message, NormalizedGroupMessagesResponse, CreateMessageRequest, MessagesPagination } from '@/types/message';


class MessagesService {
  async getGroupMessages(
    groupId: string,
    params?: { page?: number; limit?: number; before?: string }
  ): Promise<NormalizedGroupMessagesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.before) searchParams.append('before', params.before);

    const qs = searchParams.toString();
    const endpoint = qs ? `/messages/groups/${groupId}?${qs}` : `/messages/groups/${groupId}`;

    const raw = await apiClient.get<unknown>(endpoint, true);

    const normalizePagination = (input: unknown): MessagesPagination | undefined => {
      if (!input || typeof input !== 'object') return undefined;
      const p = input as Record<string, unknown>;
      const num = (k: string) => (typeof p[k] === 'number' ? (p[k] as number) : undefined);
      const bool = (k: string) => (typeof p[k] === 'boolean' ? (p[k] as boolean) : undefined);
      const currentPage = num('currentPage') ?? num('page') ?? num('current_page') ?? 1;
      const totalPages = num('totalPages') ?? num('total_pages');
      const totalCount = num('totalCount') ?? num('total');
      const hasNext = bool('hasNext') ?? bool('has_next');
      const hasPrev = bool('hasPrev') ?? bool('has_prev');
      const limit = num('limit') ?? num('perPage') ?? num('pageSize');
      return { currentPage, totalPages, totalCount, hasNext, hasPrev, limit };
    };

    let messages: Message[] = [];
    let pagination: MessagesPagination | undefined;

    const tryExtractFromContainer = (container: unknown) => {
      if (!container) return;
      if (Array.isArray(container)) {
        messages = container as Message[];
        return;
      }
      if (typeof container === 'object') {
        const obj = container as Record<string, unknown>;
        const msgs = obj['messages'];
        const items = obj['items'];
        const pag = obj['pagination'];
        if (Array.isArray(msgs)) {
          messages = msgs as Message[];
        } else if (Array.isArray(items)) {
          messages = items as Message[];
        }
        pagination = normalizePagination(pag);
      }
    };

    if (Array.isArray(raw)) {
      messages = raw as Message[];
    } else if (raw && typeof raw === 'object') {
      // Try nested `data` then root
      const r = raw as Record<string, unknown>;
      if (r['data'] !== undefined) {
        tryExtractFromContainer(r['data']);
      }
      if (messages.length === 0) {
        tryExtractFromContainer(r);
      }
    }

    return { messages, pagination };
  }

  async createMessage(groupId: string, payload: CreateMessageRequest): Promise<Message> {
    const res = await apiClient.post<{ data: Message }>(`/messages/groups/${groupId}`, payload, true);
    return res?.data;
  }

  async getMessage(messageId: string): Promise<Message> {
    const res = await apiClient.get<{ data: Message }>(`/messages/${messageId}`, true);
    return res?.data;
  }

  async updateMessage(messageId: string, content: string): Promise<Message> {
    const res = await apiClient.put<{ data: Message }>(`/messages/${messageId}`, { content }, true);
    return res?.data;
  }

  async deleteMessage(messageId: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ data: { message: string } }>(`/messages/${messageId}`, true);
    return res?.data;
  }
}

export const messagesService = new MessagesService();
