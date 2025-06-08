import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import {options} from '@/app/options';

export async function PATCH(
  request: Request,
  {params}: { params: Promise<{ userId: string }> },
) {
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

    const {userId} = await params;
    const data = await request.json();

    // isAdminまたはisActiveのみを更新可能
    const updateData: { isAdmin?: boolean; isActive?: boolean } = {};
    if (typeof data.isAdmin === 'boolean') updateData.isAdmin = data.isAdmin;
    if (typeof data.isActive === 'boolean') updateData.isActive = data.isActive;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isActive: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {status: 500},
    );
  }
}
