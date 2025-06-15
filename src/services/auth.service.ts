import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  leetcodeHandle?: string | null;
  leetcodeVerified?: boolean;
  streak?: number;
  lastSolvedAt?: string | null;
  // Add other user properties as needed
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<BackendAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Transform the backend response to match our expected AuthResponse interface
    return {
      user: response.data.user,
      token: response.data.token,
      message: response.message,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<BackendAuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Transform the backend response to match our expected AuthResponse interface
    return {
      user: response.data.user,
      token: response.data.token,
      message: response.message,
    };
  }

  async logout(): Promise<void> {
    // Remove token and user data from cookies
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
  }

  getStoredToken(): string | null {
    return Cookies.get('auth_token') || null;
  }

  getStoredUser(): User | null {
    const userData = Cookies.get('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  storeAuthData(token: string, user: User): void {
    // Store auth data in cookies with options for security
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    Cookies.set('user_data', JSON.stringify(user), { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
}

export const authService = new AuthService();
