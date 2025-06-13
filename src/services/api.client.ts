import { authService } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { requireAuth = false, ...requestOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add any existing headers
    if (requestOptions.headers) {
      if (requestOptions.headers instanceof Headers) {
        requestOptions.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(requestOptions.headers)) {
        requestOptions.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, requestOptions.headers);
      }
    }

    // Add authentication header if required
    if (requireAuth) {
      const token = authService.getStoredToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...requestOptions,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401 && requireAuth) {
        authService.logout();
        window.location.href = '/auth/login';
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {} as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // GET request
  async get<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      requireAuth,
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown, requireAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown, requireAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      requireAuth,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown, requireAuth = false): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }
}

export const apiClient = new ApiClient();
