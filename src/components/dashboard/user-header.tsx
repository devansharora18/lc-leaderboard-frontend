import { useUserProfile } from '../../hooks/useUserProfile';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

export function UserHeader() {
  const { user, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="relative h-32 w-full overflow-hidden border-b border-zinc-800">
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-4 left-4 flex items-center">
          <Skeleton className="mr-4 h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="relative h-32 w-full overflow-hidden border-b border-zinc-800">
        <div className="h-full w-full bg-zinc-800" />
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-zinc-600" />
          <div>
            <h2 className="text-lg font-bold text-red-400">Error loading profile</h2>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-32 w-full overflow-hidden border-b border-zinc-800">
      {/* Banner Image */}
      <div
        className="h-full w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')",
        }}
      ></div>

      {/* User Info Overlay */}
      <div className="absolute bottom-4 left-4 flex items-center">
        <div className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
          <Image 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=f59e0b&color=000`} 
            alt={`${user.username} profile`} 
            width={64}
            height={64}
            className="h-full w-full object-cover" 
          />
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-bold">{user.username}</h2>
            {user.leetcodeVerified && (
              <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {user.leetcodeHandle ? `LeetCode: ${user.leetcodeHandle}` : 'No LeetCode connected'} • 
            Current Streak: {user.streak} days
          </p>
        </div>
      </div>

      {/* Invite Friends Button */}
      <button className="absolute right-4 top-4 rounded-md bg-amber-500 px-3 py-1 text-sm font-medium text-black hover:bg-amber-600">
        Invite Friends
      </button>
    </div>
  )
}
