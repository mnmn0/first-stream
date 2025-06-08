'use client';

import {Card} from '@/components/ui/card';
import {DragDropContext, Draggable, Droppable, type DropResult,} from '@hello-pangea/dnd';
import {useCallback, useState} from 'react';
import {Avatar} from './ui/avatar';
import {Badge} from './ui/badge';
import type {Task, TaskStatus} from '@/types/project';

const TASK_STATUSES: TaskStatus[] = [
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
];

const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case 'TODO':
      return '未着手';
    case 'IN_PROGRESS':
      return '進行中';
    case 'IN_REVIEW':
      return 'レビュー中';
    case 'DONE':
      return '完了';
    default:
      return status;
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'TODO':
      return 'bg-gray-500';
    case 'IN_PROGRESS':
      return 'bg-blue-500';
    case 'IN_REVIEW':
      return 'bg-yellow-500';
    case 'DONE':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskClick: (taskId: string) => void;
}

export function TaskBoard({ tasks, onTaskMove, onTaskClick }: TaskBoardProps) {
  const [localTasks, setLocalTasks] = useState(tasks);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;

      const sourceStatus = result.source.droppableId as TaskStatus;
      const destinationStatus = result.destination.droppableId as TaskStatus;
      const taskId = result.draggableId;

      if (sourceStatus === destinationStatus) return;

      // 楽観的UI更新
      setLocalTasks(prev =>
        prev.map(task =>
          task.id === taskId ? {...task, status: destinationStatus} : task,
        ),
      );

      try {
        await onTaskMove(taskId, destinationStatus);
      } catch (error) {
        // エラー時は元に戻す
        setLocalTasks(prev =>
          prev.map(task =>
            task.id === taskId ? {...task, status: sourceStatus} : task,
          ),
        );
      }
    },
    [onTaskMove],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className='grid grid-cols-4 gap-4'>
        {TASK_STATUSES.map(status => (
          <div key={status} className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>{getStatusLabel(status)}</h3>
              <Badge className={getStatusColor(status)}>
                {localTasks.filter(task => task.status === status).length}
              </Badge>
            </div>
            <Droppable droppableId={status}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='space-y-2 min-h-[200px] bg-secondary/30 rounded-lg p-2'
                >
                  {localTasks
                    .filter(task => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {provided => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='p-3 cursor-pointer hover:bg-secondary/50 transition-colors'
                            onClick={() => onTaskClick(task.id)}
                          >
                            <div className='space-y-2'>
                              <h4 className='font-medium line-clamp-2'>
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className='text-sm text-muted-foreground line-clamp-2'>
                                  {task.description}
                                </p>
                              )}
                              <div className='flex items-center justify-between'>
                                <Badge variant='secondary'>
                                  {task.priority.toLowerCase()}
                                </Badge>
                                {task.assignee && (
                                  <Avatar className='h-6 w-6'>
                                    <img
                                      src={task.assignee.imageUrl || ''}
                                      alt={task.assignee.name}
                                    />
                                  </Avatar>
                                )}
                              </div>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
