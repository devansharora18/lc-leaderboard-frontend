export interface Message {
  id: string;
  content: string;
  senderId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    username: string;
  };
}

export interface MessagesPagination {
  currentPage: number;
  totalPages?: number;
  totalCount?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  limit?: number;
}

export interface NormalizedGroupMessagesResponse {
  messages: Message[];
  pagination?: MessagesPagination;
}

export interface CreateMessageRequest {
  content: string;
}
