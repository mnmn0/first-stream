import {options} from '@/app/options';
import {prisma} from '@/lib/prisma';
import {getServerSession} from 'next-auth';
import {type NextRequest, NextResponse} from 'next/server';

export async function GET(
  req: NextRequest,
  {params}: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {userId} = await params;

    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
      },
      include: {
        assignee: true,
        creator: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch user tasks:', error);
    return NextResponse.json(
      {error: 'Failed to fetch user tasks'},
      {status: 500},
    );
  }
}
