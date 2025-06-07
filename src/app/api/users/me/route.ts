import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import {options} from '@/app/options';
import {randomUUID} from 'crypto';

export async function GET() {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        isAdmin: true,
      },
    });

    console.log('User:', user);

    if (!user && session.user.email && session.user.name) {
      await prisma.user.create({
        data: {
          id: randomUUID(),
          name: session.user.name,
          email: session.user.email,
          imageUrl: session.user.image,
        },
      });
    }

    if (user && !user.imageUrl && session.user.image) {
      user.imageUrl = session.user.image;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
