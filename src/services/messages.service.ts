import { apiClient } from './api.client';
import { Message, NormalizedGroupMessagesResponse, CreateMessageRequest } from '@/types/message';


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

    const raw = await apiClient.get<any>(endpoint, true);

    const data = raw?.data;
    let messages: Message[] = [];
    let pagination: any = undefined;

    if (Array.isArray(data)) {
      messages = data as Message[];
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.messages)) {
        messages = data.messages;
      } else if (Array.isArray((data as any).items)) {
        messages = (data as any).items as Message[];
      }
      pagination = (data as any).pagination;
    }

    return { messages, pagination };
  }

  async createMessage(groupId: string, payload: CreateMessageRequest): Promise<Message> {
    const res = await apiClient.post<any>(`/messages/groups/${groupId}`, payload, true);
    return res?.data;
  }

  async getMessage(messageId: string): Promise<Message> {
    const res = await apiClient.get<any>(`/messages/${messageId}`, true);
    return res?.data;
  }

  async updateMessage(messageId: string, content: string): Promise<Message> {
    const res = await apiClient.put<any>(`/messages/${messageId}`, { content }, true);
    return res?.data;
  }

  async deleteMessage(messageId: string): Promise<{ message: string }> {
    const res = await apiClient.delete<any>(`/messages/${messageId}`, true);
    return res?.data;
  }
}

export const messagesService = new MessagesService();
