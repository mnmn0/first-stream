import {prisma} from '@/lib/prisma';
import {getServerSession} from 'next-auth';
import {options} from '@/app/options';
import {NextResponse} from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 管理者かどうかをチェック
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    if (!currentUser?.isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        {status: 403},
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {status: 500},
    );
  }
}
