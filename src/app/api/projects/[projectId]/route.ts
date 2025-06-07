import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import {options} from '@/app/options';

export async function GET(
  request: Request,
  {params}: { params: Promise<{ projectId: string }> },
) {
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

    const {projectId} = await params;

    // Check if user has access to the project
    const projectAccess = await prisma.project.findFirst({
      where: {
        id: projectId,
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
      select: { id: true },
    });

    if (!projectAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get full project details
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  {params}: { params: Promise<{ projectId: string }> },
) {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.email) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const user = await prisma.user.findUnique({
      where: {email: session.user.email},
      select: {id: true},
    });

    if (!user) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const {projectId} = await params;

    const projectAccess = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: user.id,
      },
    });

    if (!projectAccess) {
      return NextResponse.json({error: 'Access denied'}, {status: 403});
    }

    const body = await request.json();
    const {action, task} = body;

    if (action === 'createTask') {
      const newTask = await prisma.task.create({
        data: {
          projectId,
          title: task.title,
          description: task.description || null,
          status: task.status || 'TODO',
          priority: task.priority || 'MEDIUM',
          assignedTo: task.assignedTo || null,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          estimatedHours: task.estimatedHours || null,
          createdBy: user.id,
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      });

      return NextResponse.json(newTask);
    }

    return NextResponse.json({error: 'Invalid action'}, {status: 400});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: 'Internal server error'},
      {status: 500},
    );
  }
}
