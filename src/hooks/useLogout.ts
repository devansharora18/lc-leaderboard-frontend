import { useAuth } from '@/contexts/auth.context';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return {
    logout: handleLogout,
  };
}
