import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '@/hooks/use-project';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { project, isLoading, isError } = useProject(params.projectId);

  if (isError) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-destructive'>プロジェクトの取得に失敗しました</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4 p-4'>
        <Skeleton className='h-8 w-[200px]' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    );
  }

  if (!project) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-muted-foreground'>プロジェクトが見つかりません</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-yellow-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'ON_HOLD':
        return 'bg-orange-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '未設定';
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{project.name}</h1>
          <p className='text-muted-foreground'>
            {project.description || '説明なし'}
          </p>
        </div>
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
      </div>

      <Card className='p-6'>
        <h2 className='text-lg font-semibold mb-4'>プロジェクト情報</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>開始日</p>
            <p>{formatDate(project.startDate)}</p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>終了日</p>
            <p>{formatDate(project.endDate)}</p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>作成者</p>
            <div className='flex items-center gap-2'>
              <Avatar>
                <img
                  src={project.creator.imageUrl || ''}
                  alt={project.creator.name}
                />
              </Avatar>
              <span>{project.creator.name}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>メンバー</h2>
          <ScrollArea className='h-[200px]'>
            <div className='space-y-4'>
              {project.members.map(member => (
                <div
                  key={member.userId}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <Avatar>
                      <img
                        src={member.user.imageUrl || ''}
                        alt={member.user.name}
                      />
                    </Avatar>
                    <div>
                      <p>{member.user.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge>{member.role}</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      <Card>
        <div className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>タスク</h2>
          <ScrollArea className='h-[300px]'>
            <div className='space-y-4'>
              {project.tasks.map(task => (
                <Card key={task.id} className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium'>{task.title}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {task.description || '説明なし'}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      {task.assignee && (
                        <Avatar>
                          <img
                            src={task.assignee.imageUrl || ''}
                            alt={task.assignee.name}
                          />
                        </Avatar>
                      )}
                      <Badge>{task.status}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
