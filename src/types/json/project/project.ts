import type { Member } from '@/types/json/user/member';

type CreateProject = {
  name: string;
  description: string;
  members: Member[];
  icon?: string;
};

export type { CreateProject };
