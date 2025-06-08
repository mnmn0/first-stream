'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import Holidays from 'date-holidays';
import type React from 'react';
import {useMemo} from 'react';

type Task = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
};

type GanttChartProps = {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
};

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  startDate,
  endDate,
}) => {
  const holidays = useMemo(() => {
    const hd = new Holidays();
    hd.init('JP', 'ja', { timezone: 'Asia/Tokyo' });
    return hd;
  }, []);

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );

  const today = new Date(); // 現在の日付
  const todayPosition = Math.max(
    0,
    (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );
  const todayLeft = (todayPosition / totalDays) * 100;

  // 月の名前を取得する関数
  const getMonthName = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', { month: 'short' }).format(date);
  };

  // 前の日付と月が異なるかチェックする関数
  const isNewMonth = (currentDate: Date, prevDate: Date) => {
    return currentDate.getMonth() !== prevDate.getMonth();
  };

  // 土日または祝日かどうかを判定する関数
  const isHoliday = (date: Date) => {
    const day = date.getDay();
    const isPublicHoliday = holidays.isHoliday(date);
    return day === 0 || day === 6 || isPublicHoliday;
  };

  // 休日の種類を判定する関数
  const getHolidayType = (
    date: Date,
  ): 'saturday' | 'sundayOrHoliday' | null => {
    const day = date.getDay();
    const isPublicHoliday = holidays.isHoliday(date);

    if (day === 6) return 'saturday';
    if (day === 0 || isPublicHoliday) return 'sundayOrHoliday';
    return null;
  };

  // 背景色のクラスを取得する関数
  const getBackgroundColorClass = (date: Date): string => {
    const holidayType = getHolidayType(date);
    switch (holidayType) {
      case 'saturday':
        return 'bg-blue-50';
      case 'sundayOrHoliday':
        return 'bg-pink-50';
      default:
        return '';
    }
  };

  const getTaskPosition = (task: Task) => {
    const start = Math.max(
      0,
      (task.startDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    );
    const duration =
      (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 3600 * 24);
    const left = (start / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>プロジェクトガントチャート</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] w-full'>
          <div className='relative w-full' style={{ minWidth: '800px' }}>
            {/* 祝休日の背景 */}
            <div className='absolute top-4 bottom-0 w-full'>
              {Array.from({length: totalDays}, (_, index) => {
                const date = new Date(
                  startDate.getTime() + index * 24 * 60 * 60 * 1000,
                );
                const backgroundColorClass = getBackgroundColorClass(date);
                if (backgroundColorClass) {
                  return (
                    <div
                      key={`holiday-bg-${date.getTime()}`}
                      className={`absolute h-full ${backgroundColorClass}`}
                      style={{
                        left: `${(index / totalDays) * 100}%`,
                        width: `${(1 / totalDays) * 100}%`,
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>

            {/* 時間軸（月と日付） */}
            <div className='mb-2 relative'>
              {/* 月表示 */}
              <div className='flex border-b'>
                {Array.from({length: totalDays}, (_, index) => {
                  const currentDate = new Date(
                    startDate.getTime() + index * 24 * 60 * 60 * 1000,
                  );
                  const prevDate = new Date(
                    startDate.getTime() + (index - 1) * 24 * 60 * 60 * 1000,
                  );
                  const showMonth =
                    index === 0 || isNewMonth(currentDate, prevDate);

                  return (
                    <div
                      key={`month-${currentDate.getTime()}`}
                      className='flex-1 text-center text-xs'
                    >
                      {showMonth && (
                        <div className='font-medium'>
                          {getMonthName(currentDate)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* 日付表示 */}
              <div className='flex border-b'>
                {Array.from({ length: totalDays }).map((_, index) => {
                  const date = new Date(
                    startDate.getTime() + index * 24 * 60 * 60 * 1000,
                  );
                  return (
                    <div
                      key={`day-${date.toISOString()}`}
                      className='flex-1 text-center text-xs'
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 現在日付の線 */}
            <div
              className='absolute top-0 bottom-0 w-px bg-red-500'
              style={{
                left: `${todayLeft}%`,
                zIndex: 10,
              }}
            />

            {/* タスク */}
            {tasks.map(task => (
              <div key={task.id} className='flex items-center mb-2'>
                <div className='w-1/4 pr-2 text-sm'>{task.name}</div>
                <div className='w-3/4 relative h-6'>
                  <div
                    className='absolute h-full bg-blue-500 rounded overflow-hidden'
                    style={getTaskPosition(task)}
                  >
                    <div
                      className='h-full bg-blue-700'
                      style={{
                        width: `${task.progress}%`,
                        background: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.2) 10px,
                        rgba(255,255,255,0.2) 20px
                      )`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
