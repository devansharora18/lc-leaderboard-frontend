import { useState } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { LoginCredentials } from '@/services/auth.service';

export function useLogin() {
  const { login, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsSubmitting(true);
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login: handleLogin,
    isLoading: isLoading || isSubmitting,
    error,
    clearError,
  };
}
