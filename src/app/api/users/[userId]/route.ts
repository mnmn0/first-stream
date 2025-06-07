import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export async function GET(
  request: Request,
  {params}: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: (await params).userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {error: 'User not found'},
        {status: 404}
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      {error: 'Failed to fetch user'},
      {status: 500}
    );
  }
}
