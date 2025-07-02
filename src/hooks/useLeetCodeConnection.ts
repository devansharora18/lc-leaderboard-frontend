import { useState, useCallback, useRef } from 'react';
import { leetcodeService } from '@/services/leetcode.service';

export interface LeetCodeConnectionState {
  isConnecting: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  verificationCode: string | null;
  instructions: string | null;
  error: string | null;
  leetcodeUsername: string | null;
}

export function useLeetCodeConnection() {
  const [state, setState] = useState<LeetCodeConnectionState>({
    isConnecting: false,
    isVerifying: false,
    isVerified: false,
    verificationCode: null,
    instructions: null,
    error: null,
    leetcodeUsername: null,
  });

  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearPolling = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startVerificationPolling = useCallback((timeoutInSeconds: number, pollIntervalInSeconds: number) => {
    clearPolling(); // Clear any existing polling

    const pollVerificationStatus = async () => {
      try {
        const response = await leetcodeService.getVerificationStatus();
        if (response.data.isVerified) {
          setState(prev => ({
            ...prev,
            isVerifying: false,
            isVerified: true,
            error: null,
          }));
          clearPolling();
        } else if (!response.data.isInProgress) {
          setState(prev => ({
            ...prev,
            isVerifying: false,
            error: 'Verification failed or timed out',
          }));
          clearPolling();
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isVerifying: false,
          error: error instanceof Error ? error.message : 'Failed to check verification status',
        }));
        clearPolling();
      }
    };

    // Start polling every pollIntervalInSeconds
    pollIntervalRef.current = setInterval(pollVerificationStatus, pollIntervalInSeconds * 1000);

    // Set timeout to stop polling after timeoutInSeconds
    pollTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isVerifying: false,
        error: 'Verification timed out. Please try again.',
      }));
      clearPolling();
    }, timeoutInSeconds * 1000);
  }, [clearPolling]);

  const connectLeetCode = useCallback(async (leetcodeUsername: string) => {
    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
      isVerified: false,
      verificationCode: null,
      instructions: null,
    }));

    try {
      const response = await leetcodeService.connectLeetCode(leetcodeUsername);
      
      setState(prev => ({
        ...prev,
        isConnecting: false,
        isVerifying: true,
        verificationCode: response.data.verificationCode,
        instructions: response.data.instructions,
        leetcodeUsername: response.data.leetcodeUsername,
      }));

      // Start polling for verification status
      startVerificationPolling(response.data.timeoutInSeconds, response.data.pollIntervalInSeconds);

      return { success: true, data: response.data };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect LeetCode account',
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to connect LeetCode account' };
    }
  }, [startVerificationPolling]);

  const resetConnection = useCallback(() => {
    clearPolling();
    setState({
      isConnecting: false,
      isVerifying: false,
      isVerified: false,
      verificationCode: null,
      instructions: null,
      error: null,
      leetcodeUsername: null,
    });
  }, [clearPolling]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    connectLeetCode,
    resetConnection,
    clearError,
  };
}
