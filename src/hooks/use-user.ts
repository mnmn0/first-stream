import useSWR from 'swr';
import {fetcher} from '@/lib/api/fetcher';
import type {User} from '@prisma/client';

export const useUser = () => {
  const {
    data: currentUser,
    error: currentUserError,
    isLoading: isCurrentUserLoading,
    mutate: mutateCurrentUser,
  } = useSWR<User>('/api/users/me', fetcher);

  const {
    data: users,
    error: usersError,
    isLoading: isUsersLoading,
    mutate: mutateUsers,
  } = useSWR<User[]>('/api/users', fetcher);

  return {
    currentUser: {
      data: currentUser,
      error: currentUserError,
      isLoading: isCurrentUserLoading,
      mutate: mutateCurrentUser,
    },
    users: {
      data: users,
      error: usersError,
      isLoading: isUsersLoading,
      mutate: mutateUsers,
    },
  };
};
