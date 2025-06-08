import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import {options} from '@/app/options';

export async function GET() {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get projects where user is either a member or creator
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdBy: user.id },
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        startDate: true,
        endDate: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!projects) {
      return NextResponse.json({ error: 'No projects found' }, { status: 404 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      {status: 500},
    );
  }
}
