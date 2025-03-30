import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateTaskSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
});

export async function PATCH(
  req: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = updateTaskSchema.parse(json);

    // プロジェクトメンバーのチェック
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: params.projectId,
          userId: session.user.id,
        },
      },
    });

    if (!member) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
        projectId: params.projectId,
      },
    });

    if (!task) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        status: body.status,
      },
      include: {
        assignee: true,
        creator: true,
        comments: {
          include: {
            user: true,
          },
        },
        attachments: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('[TASK_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}