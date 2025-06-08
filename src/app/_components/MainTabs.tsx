'use client';

import GanttChart from '@/components/gantt-chart';
import {TaskBoard} from '@/components/task-board';
import {Avatar} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Skeleton} from '@/components/ui/skeleton';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useProject} from '@/hooks/use-project';
import {useToast} from '@/hooks/use-toast';
import {useUser} from '@/hooks/use-user';
import {fetcher} from '@/lib/api/fetcher';
import type {Task, TaskStatus} from '@/types/project';
import type {User} from '@prisma/client';
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  FolderKanban,
  LayoutGrid,
  Plus,
  Users,
} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {use, useCallback, useEffect, useState} from 'react';
import useSWR from 'swr';
import {CreateTaskModal} from '../project/[projectId]/_components/CreateTaskModal';
import {NavigationTabs, type TabItem} from './NavigationTabs';

interface TaskWithProject extends Omit<Task, 'project'> {
  project: {
    id: string;
    name: string;
  };
}

interface UserWithStats extends User {
  assignedTasks: TaskWithProject[];
  createdTasks: TaskWithProject[];
  _count?: {
    assignedTasks: number;
    createdTasks: number;
  };
}

const tabs: TabItem[] = [
  {
    id: 'persons',
    label: 'Persons',
    icon: Users,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
  },
];

interface MainTabsProps {
  params?: Promise<{ userId?: string; projectId?: string }>;
}

export function MainTabs({params}: MainTabsProps) {
  const pathname = usePathname();
  const {toast} = useToast();
  const {currentUser} = useUser();
  const {projects, projectsLoading} = useProject();

  // URLに基づいてデフォルトタブを決定
  const getDefaultTab = useCallback(() => {
    if (pathname.startsWith('/person')) {
      return tabs[0]; // persons
    }
    if (pathname.startsWith('/project')) {
      return tabs[1]; // projects
    }
    return tabs[0]; // デフォルトはpersons
  }, [pathname]);

  const [selectedTab, setSelectedTab] = useState<TabItem>(getDefaultTab());
  const [activePersonTab, setActivePersonTab] = useState('assigned');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  // URLが変更された時にタブを更新
  useEffect(() => {
    setSelectedTab(getDefaultTab());
  }, [getDefaultTab]);

  // paramsからuserIdやprojectIdを取得
  const resolvedParams = params ? use(params) : null;
  const userId = resolvedParams?.userId || currentUser.data?.id;
  const projectId = resolvedParams?.projectId;

  // ユーザー情報とタスクを取得
  const {data: userDetails, isLoading: userLoading} = useSWR<UserWithStats>(
    userId ? `/api/users/${userId}` : null,
    fetcher,
  );

  const {data: userTasks, isLoading: tasksLoading} = useSWR<
    TaskWithProject[]
  >(userId ? `/api/users/${userId}/tasks` : null, fetcher);

  // プロジェクト詳細を取得（projectIdが指定されている場合）
  const {project, isLoading: projectLoading, mutate} = useProject(projectId);

  const handleTabChange = (tab: TabItem) => {
    setSelectedTab(tab);
    // URLは変更しない（useState管理）
  };

  const getTasksByStatus = (
    tasks: TaskWithProject[] | undefined,
    status: string,
  ) => {
    if (!tasks) return [];
    return tasks.filter(task => task.status === status);
  };

  const getUpcomingTasks = (tasks: TaskWithProject[] | undefined) => {
    if (!tasks) return [];

    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tasks
      .filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return (
          dueDate >= now && dueDate <= oneWeekFromNow && task.status !== 'DONE'
        );
      })
      .sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dateA - dateB;
      });
  };

  const handleTaskClick = useCallback((task: TaskWithProject) => {
    // URLを変更せずにタスク詳細を表示（将来的にモーダルやサイドパネルで実装）
    console.log('Task clicked:', task);
  }, []);

  const handlePersonTaskClickById = useCallback(
    (taskId: string) => {
      const task = userTasks?.find(t => t.id === taskId);
      if (task) {
        handleTaskClick(task);
      }
    },
    [userTasks, handleTaskClick],
  );

  const handleTaskMove = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      if (!projectId) return;

      try {
        const response = await fetch(
          `/api/projects/${projectId}/tasks/${taskId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({status: newStatus}),
          },
        );

        if (!response.ok) {
          throw new Error('タスクの更新に失敗しました');
        }

        await mutate();
        toast({
          description: 'タスクのステータスを更新しました',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'エラー',
          description:
            error instanceof Error
              ? error.message
              : 'タスクの更新に失敗しました',
        });
        throw error;
      }
    },
    [projectId, mutate, toast],
  );

  const handlePersonTaskMove = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      try {
        const task = userTasks?.find(t => t.id === taskId);
        if (!task) return;

        const response = await fetch(
          `/api/projects/${task.projectId}/tasks/${taskId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({status: newStatus}),
          },
        );

        if (!response.ok) {
          throw new Error('タスクの更新に失敗しました');
        }

        // SWRのデータを再取得
        await fetch(`/api/users/${userId}/tasks`).then(() => {
          window.location.reload(); // 簡易的な再読み込み
        });

        toast({
          description: 'タスクのステータスを更新しました',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'エラー',
          description:
            error instanceof Error
              ? error.message
              : 'タスクの更新に失敗しました',
        });
        throw error;
      }
    },
    [userTasks, userId, toast],
  );

  const handleProjectTaskClick = useCallback(
    (taskId: string) => {
      if (!projectId) return;
      // URLを変更せずにタスク詳細を表示（将来的にモーダルやサイドパネルで実装）
      console.log('Project task clicked:', taskId);
    },
    [projectId],
  );

  if (currentUser.isLoading) {
    return (
      <div className='container mx-auto p-6 space-y-6'>
        <Skeleton className='h-10 w-64'/>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Skeleton className='h-32'/>
          <Skeleton className='h-32'/>
          <Skeleton className='h-32'/>
          <Skeleton className='h-32'/>
        </div>
      </div>
    );
  }

  const renderPersonsContent = () => {
    if (userLoading || tasksLoading) {
      return (
        <div className='container mx-auto p-6 space-y-6'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-16 w-16 rounded-full'/>
            <div className='space-y-2'>
              <Skeleton className='h-8 w-48'/>
              <Skeleton className='h-4 w-32'/>
            </div>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Skeleton className='h-32'/>
            <Skeleton className='h-32'/>
            <Skeleton className='h-32'/>
            <Skeleton className='h-32'/>
          </div>
        </div>
      );
    }

    if (!userDetails) {
      return (
        <div className='flex items-center justify-center h-full'>
          <p className='text-muted-foreground'>ユーザーが見つかりません</p>
        </div>
      );
    }

    const todoTasks = getTasksByStatus(userTasks, 'TODO');
    const inProgressTasks = getTasksByStatus(userTasks, 'IN_PROGRESS');
    const inReviewTasks = getTasksByStatus(userTasks, 'IN_REVIEW');
    const doneTasks = getTasksByStatus(userTasks, 'DONE');
    const upcomingTasks = getUpcomingTasks(userTasks);

    return (
      <div className='container mx-auto p-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-16 w-16'>
            {userDetails.imageUrl ? (
              <img src={userDetails.imageUrl} alt={userDetails.name}/>
            ) : (
              <div className='h-full w-full bg-secondary flex items-center justify-center text-2xl'>
                {userDetails.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <h1 className='text-2xl font-bold'>{userDetails.name}</h1>
            <p className='text-muted-foreground'>{userDetails.email}</p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>未着手</CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground'/>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{todoTasks.length}</div>
              <p className='text-xs text-muted-foreground'>タスク</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>進行中</CardTitle>
              <AlertCircle className='h-4 w-4 text-blue-600'/>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{inProgressTasks.length}</div>
              <p className='text-xs text-muted-foreground'>タスク</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>レビュー中</CardTitle>
              <AlertCircle className='h-4 w-4 text-yellow-600'/>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{inReviewTasks.length}</div>
              <p className='text-xs text-muted-foreground'>タスク</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>完了</CardTitle>
              <CheckCircle2 className='h-4 w-4 text-green-600'/>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{doneTasks.length}</div>
              <p className='text-xs text-muted-foreground'>タスク</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>タスク一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activePersonTab} onValueChange={setActivePersonTab}>
              <TabsList className='grid w-full grid-cols-5'>
                <TabsTrigger value='assigned'>担当中</TabsTrigger>
                <TabsTrigger value='todo'>未着手</TabsTrigger>
                <TabsTrigger value='in_progress'>進行中</TabsTrigger>
                <TabsTrigger value='upcoming'>期限が近い</TabsTrigger>
                <TabsTrigger value='kanban'>カンバン</TabsTrigger>
              </TabsList>
              <TabsContent value='assigned'>
                <ScrollArea className='h-[400px]'>
                  <div className='space-y-2'>
                    {userTasks && userTasks.length > 0 ? (
                      userTasks.map(task => (
                        <button
                          key={task.id}
                          className='p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors w-full text-left'
                          onClick={() => handleTaskClick(task)}
                          type='button'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h3 className='font-medium'>{task.title}</h3>
                              <p className='text-sm text-muted-foreground'>
                                {task.project.name}
                              </p>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Badge variant='outline'>
                                {task.status === 'TODO'
                                  ? '未着手'
                                  : task.status === 'IN_PROGRESS'
                                    ? '進行中'
                                    : task.status === 'IN_REVIEW'
                                      ? 'レビュー中'
                                      : '完了'}
                              </Badge>
                              {task.dueDate && (
                                <span className='text-xs text-muted-foreground flex items-center'>
                                  <Calendar className='h-3 w-3 mr-1'/>
                                  {new Date(task.dueDate).toLocaleDateString(
                                    'ja-JP',
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className='text-center text-muted-foreground py-8'>
                        タスクがありません
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              {/* 他のタブコンテンツも同様に実装 */}
              <TabsContent value='todo'>
                <ScrollArea className='h-[400px]'>
                  <div className='space-y-2'>
                    {todoTasks.length > 0 ? (
                      todoTasks.map(task => (
                        <button
                          key={task.id}
                          className='p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors w-full text-left'
                          onClick={() => handleTaskClick(task)}
                          type='button'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h3 className='font-medium'>{task.title}</h3>
                              <p className='text-sm text-muted-foreground'>
                                {task.project.name}
                              </p>
                            </div>
                            {task.dueDate && (
                              <span className='text-xs text-muted-foreground flex items-center'>
                                <Calendar className='h-3 w-3 mr-1'/>
                                {new Date(task.dueDate).toLocaleDateString(
                                  'ja-JP',
                                )}
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className='text-center text-muted-foreground py-8'>
                        未着手のタスクはありません
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value='in_progress'>
                <ScrollArea className='h-[400px]'>
                  <div className='space-y-2'>
                    {inProgressTasks.length > 0 ? (
                      inProgressTasks.map(task => (
                        <button
                          key={task.id}
                          className='p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors w-full text-left'
                          onClick={() => handleTaskClick(task)}
                          type='button'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h3 className='font-medium'>{task.title}</h3>
                              <p className='text-sm text-muted-foreground'>
                                {task.project.name}
                              </p>
                            </div>
                            {task.dueDate && (
                              <span className='text-xs text-muted-foreground flex items-center'>
                                <Calendar className='h-3 w-3 mr-1'/>
                                {new Date(task.dueDate).toLocaleDateString(
                                  'ja-JP',
                                )}
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className='text-center text-muted-foreground py-8'>
                        進行中のタスクはありません
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value='upcoming'>
                <ScrollArea className='h-[400px]'>
                  <div className='space-y-2'>
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map(task => (
                        <button
                          key={task.id}
                          className='p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors w-full text-left'
                          onClick={() => handleTaskClick(task)}
                          type='button'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h3 className='font-medium'>{task.title}</h3>
                              <p className='text-sm text-muted-foreground'>
                                {task.project.name}
                              </p>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Badge
                                variant={
                                  task.priority === 'HIGH'
                                    ? 'destructive'
                                    : task.priority === 'MEDIUM'
                                      ? 'default'
                                      : 'secondary'
                                }
                              >
                                {task.priority === 'HIGH'
                                  ? '高'
                                  : task.priority === 'MEDIUM'
                                    ? '中'
                                    : '低'}
                              </Badge>
                              {task.dueDate && (
                                <span className='text-xs text-muted-foreground flex items-center'>
                                  <Calendar className='h-3 w-3 mr-1'/>
                                  {new Date(task.dueDate).toLocaleDateString(
                                    'ja-JP',
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className='text-center text-muted-foreground py-8'>
                        期限が近いタスクはありません
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value='kanban'>
                {userTasks && userTasks.length > 0 ? (
                  <TaskBoard
                    tasks={userTasks as unknown as Task[]}
                    onTaskMove={handlePersonTaskMove}
                    onTaskClick={handlePersonTaskClickById}
                  />
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    カンバンに表示するタスクがありません
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProjectsContent = () => {
    if (projectId && project) {
      // 特定のプロジェクト詳細を表示
      if (projectLoading) {
        return (
          <div className='space-y-4 p-4'>
            <Skeleton className='h-8 w-[200px]'/>
            <Skeleton className='h-32 w-full'/>
            <Skeleton className='h-48 w-full'/>
          </div>
        );
      }

      const ganttTasks = project.tasks
        .filter(task => task.dueDate)
        .map(task => ({
          id: task.id,
          name: task.title,
          startDate: task.createdAt ? new Date(task.createdAt) : new Date(),
          endDate: task.dueDate
            ? new Date(task.dueDate)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          progress:
            task.status === 'DONE'
              ? 100
              : task.status === 'IN_REVIEW'
                ? 75
                : task.status === 'IN_PROGRESS'
                  ? 50
                  : 0,
        }));

      const projectStartDate = project.startDate
        ? new Date(project.startDate)
        : new Date();
      const projectEndDate = project.endDate
        ? new Date(project.endDate)
        : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      return (
        <div className='space-y-6 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>{project.name}</h1>
              <p className='text-muted-foreground'>
                {project.description || '説明なし'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Badge
                className={`${
                  project.status === 'IN_PROGRESS'
                    ? 'bg-blue-500'
                    : project.status === 'PLANNING'
                      ? 'bg-yellow-500'
                      : project.status === 'COMPLETED'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                }`}
              >
                {project.status}
              </Badge>
              <Button onClick={() => setIsCreateTaskModalOpen(true)}>
                <Plus className='h-4 w-4 mr-2'/>
                タスクを追加
              </Button>
            </div>
          </div>

          <Card className='p-6'>
            <h2 className='text-lg font-semibold mb-4'>プロジェクト情報</h2>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>開始日</p>
                <p>
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString('ja-JP')
                    : '未設定'}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>終了日</p>
                <p>
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString('ja-JP')
                    : '未設定'}
                </p>
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
              <Tabs defaultValue='board' className='space-y-4'>
                <TabsList>
                  <TabsTrigger value='board'>
                    <LayoutGrid className='h-4 w-4 mr-2'/>
                    ボード
                  </TabsTrigger>
                  <TabsTrigger value='gantt'>
                    <CalendarDays className='h-4 w-4 mr-2'/>
                    ガントチャート
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='board'>
                  <TaskBoard
                    tasks={project.tasks}
                    onTaskMove={handleTaskMove}
                    onTaskClick={handleProjectTaskClick}
                  />
                </TabsContent>
                <TabsContent value='gantt'>
                  {ganttTasks.length > 0 ? (
                    <GanttChart
                      tasks={ganttTasks}
                      startDate={projectStartDate}
                      endDate={projectEndDate}
                    />
                  ) : (
                    <div className='text-center py-8 text-muted-foreground'>
                      期限が設定されたタスクがありません
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            onClose={() => setIsCreateTaskModalOpen(false)}
            projectId={projectId}
            members={project.members}
            onTaskCreated={mutate}
          />
        </div>
      );
    }

    // プロジェクト一覧を表示
    if (projectsLoading) {
      return (
        <div className='container mx-auto p-6 space-y-6'>
          <Skeleton className='h-10 w-64'/>
          <div className='grid gap-4'>
            <Skeleton className='h-32'/>
            <Skeleton className='h-32'/>
            <Skeleton className='h-32'/>
          </div>
        </div>
      );
    }

    return (
      <div className='container mx-auto p-6 space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>プロジェクト一覧</h1>
        </div>

        <div className='grid gap-6'>
          {projects && projects.length > 0 ? (
            projects.map(project => (
              <Card
                key={project.id}
                className='cursor-pointer hover:shadow-md transition-shadow'
                onClick={() => {
                  // URLを変更せずにプロジェクト詳細を表示（将来的にモーダルやサイドパネルで実装）
                  console.log('Project clicked:', project.id);
                }}
              >
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant='outline'>
                      {project.status === 'IN_PROGRESS'
                        ? '進行中'
                        : project.status === 'PLANNING'
                          ? '計画中'
                          : project.status === 'COMPLETED'
                            ? '完了'
                            : project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground mb-4'>
                    {project.description || '説明なし'}
                  </p>
                  <div className='flex items-center justify-between text-sm text-muted-foreground'>
                    <span>{project.tasks?.length || 0} タスク</span>
                    <span>メンバー {project.members?.length || 0}名</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className='pt-6'>
                <p className='text-center text-muted-foreground'>
                  プロジェクトがありません
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b'>
        <div className='container mx-auto px-6 py-4'>
          <NavigationTabs
            tabs={tabs}
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      <div className='flex-1'>
        {selectedTab.id === 'persons' && renderPersonsContent()}
        {selectedTab.id === 'projects' && renderProjectsContent()}
      </div>
    </div>
  );
}
