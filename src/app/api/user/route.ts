import type { Member } from '@/types/json/user/member';
import { NextResponse } from 'next/server';

export async function GET() {
  const members: Member[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/avatar1.png',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/avatar2.png',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      avatar: '/avatar3.png',
    },
  ];
  return NextResponse.json(members);
}
