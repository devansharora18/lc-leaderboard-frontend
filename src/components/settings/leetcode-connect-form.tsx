import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLeetCodeConnection } from '@/hooks/useLeetCodeConnection';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';

interface LeetCodeConnectFormProps {
  onSuccess?: () => void;
}

export function LeetCodeConnectForm({ onSuccess }: LeetCodeConnectFormProps) {
  const [username, setUsername] = useState('');
  const { user, loading: profileLoading } = useUserProfile();
  const {
    isConnecting,
    isVerifying,
    isVerified,
    verificationCode,
    instructions,
    error,
    leetcodeUsername,
    connectLeetCode,
    resetConnection,
    clearError,
  } = useLeetCodeConnection();

  // Set initial username from user profile if available
  useEffect(() => {
    if (user?.leetcodeHandle && !username) {
      setUsername(user.leetcodeHandle);
    }
  }, [user, username]);

  if (profileLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // Show current connection status if user has LeetCode connected
  if (user?.leetcodeVerified && user?.leetcodeHandle && !isVerifying && !isConnecting) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-900 bg-green-950 p-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <h3 className="text-sm font-medium text-green-400">
              LeetCode Account Connected
            </h3>
          </div>
          <p className="mt-1 text-sm text-green-300">
            Your LeetCode account &ldquo;{user.leetcodeHandle}&rdquo; is connected and verified.
          </p>
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <span className="text-gray-300">Current Streak: <span className="text-white font-medium">{user.streak} days</span></span>
            {user.lastSolvedAt && (
              <span className="text-gray-300">
                Last Solved: <span className="text-white font-medium">
                  {new Date(user.lastSolvedAt).toLocaleDateString()}
                </span>
              </span>
            )}
          </div>
        </div>
        <Button 
          onClick={() => {
            resetConnection();
            setUsername('');
          }}
          variant="outline"
          className="w-full border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
        >
          Update LeetCode Connection
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const result = await connectLeetCode(username.trim());
    if (result.success) {
      // Form will show verification step automatically
    }
  };

  const handleTryAgain = () => {
    resetConnection();
    setUsername('');
  };

  if (isVerified) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-900 bg-green-950 p-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <h3 className="text-sm font-medium text-green-400">
              LeetCode Account Connected Successfully!
            </h3>
          </div>
          <p className="mt-1 text-sm text-green-300">
            Your LeetCode account &ldquo;{leetcodeUsername}&rdquo; has been verified and connected.
          </p>
        </div>
        <Button 
          onClick={() => {
            handleTryAgain();
            onSuccess?.();
          }}
          variant="outline"
          className="w-full border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
        >
          Connect Another Account
        </Button>
      </div>
    );
  }

  if (isVerifying && verificationCode) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-blue-900 bg-blue-950 p-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="text-sm font-medium text-blue-400">
              Verification in Progress
            </h3>
          </div>
          <p className="mt-1 text-sm text-blue-300">
            {instructions}
          </p>
        </div>
        
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Verification Code
          </label>
          <div className="flex items-center space-x-2">
            <Input
              value={verificationCode}
              readOnly
              className="font-mono text-center bg-zinc-900 border-zinc-600 text-white"
            />
            <Button
              onClick={() => navigator.clipboard.writeText(verificationCode)}
              variant="outline"
              size="sm"
              className="border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600"
            >
              Copy
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Copy this code and set it as your LeetCode real name. We&rsquo;ll automatically verify once you&rsquo;ve updated it.
          </p>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleTryAgain} 
            variant="outline" 
            className="flex-1 border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => window.open('https://leetcode.com/profile/', '_blank')}
            className="flex-1 bg-amber-500 text-black hover:bg-amber-600"
          >
            Open LeetCode Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 p-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <h3 className="text-sm font-medium text-red-400">Error</h3>
          </div>
          <p className="mt-1 text-sm text-red-300">{error}</p>
          <Button
            onClick={clearError}
            variant="ghost"
            size="sm"
            className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-900"
          >
            Dismiss
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="leetcode-username" className="block text-sm font-medium text-gray-300">
            LeetCode Username
          </label>
          <Input
            id="leetcode-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your LeetCode username"
            disabled={isConnecting}
            required
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400">
            Enter your LeetCode username (not email) to connect your account.
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={isConnecting || !username.trim()}
          className="w-full bg-amber-500 text-black hover:bg-amber-600 disabled:bg-zinc-700 disabled:text-gray-500"
        >
          {isConnecting ? 'Connecting...' : 'Connect LeetCode Account'}
        </Button>
      </form>
    </div>
  );
}
