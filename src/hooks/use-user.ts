import { User } from '@/types/user';
import { useHttp } from './use-http';

export const useUser = () => {
  const http = useHttp();

  return {
    users: http.get<User[]>('/api/users'),
    currentUser: http.get<User>('/api/auth/me'),
    getUser: (userId: string) => http.get<User>(`/api/users/${userId}`),
    getUserByEmail: (email: string) => http.get<User>(`/api/users/email/${email}`),
  };
}

