import { fetcher } from '@/lib/api/fetcher';
import type { Member } from '@/types/json/user/member';
import useSWR from 'swr';

const getUsers = await fetcher<Member[]>('/api/user');

const { data, error } = useSWR('/api/user', fetcher);

export { getUsers };
