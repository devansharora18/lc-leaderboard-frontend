import { useState } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { SignupCredentials } from '@/services/auth.service';

export function useSignup() {
  const { signup, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (credentials: SignupCredentials) => {
    setIsSubmitting(true);
    try {
      await signup(credentials);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    signup: handleSignup,
    isLoading: isLoading || isSubmitting,
    error,
    clearError,
  };
}
