'use client';

import GanttChart from '@/components/gantt-chart';

const tasks = [
  {
    id: '1',
    name: 'タスク1',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-10'),
    progress: 60,
  },
  {
    id: '2',
    name: 'タスク2',
    startDate: new Date('2024-12-05'),
    endDate: new Date('2024-12-15'),
    progress: 60,
  },
  {
    id: '3',
    name: 'タスク3',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '4',
    name: 'タスク4',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-25'),
    progress: 60,
  },
  {
    id: '5',
    name: 'タスク5',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '6',
    name: 'タスク6',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '7',
    name: 'タスク7',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '8',
    name: 'タスク8',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '9',
    name: 'タスク9',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '10',
    name: 'タスク10',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '11',
    name: 'タスク11',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '12',
    name: 'タスク12',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '13',
    name: 'タスク13',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
  {
    id: '14',
    name: 'タスク14',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-20'),
    progress: 60,
  },
];

export default function GanttChartDemo() {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-4'>ガントチャートデモ</h1>
      <GanttChart
        tasks={tasks}
        startDate={new Date('2024-12-01')}
        endDate={new Date('2024-12-30')}
      />
    </div>
  );
}
