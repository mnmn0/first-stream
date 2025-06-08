'use client';

import {useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {useToast} from '@/hooks/use-toast';
import {Calendar} from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  members: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      imageUrl?: string | null;
    };
  }>;
  onTaskCreated: () => void;
}

export function CreateTaskModal({
                                  isOpen,
                                  onClose,
                                  projectId,
                                  members,
                                  onTaskCreated,
                                }: CreateTaskModalProps) {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: 'タスク名を入力してください',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createTask',
          task: {
            ...formData,
            status: 'TODO',
            dueDate: formData.dueDate || null,
            estimatedHours: formData.estimatedHours
              ? Number.parseFloat(formData.estimatedHours)
              : null,
            assignedTo: formData.assignedTo || null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('タスクの作成に失敗しました');
      }

      toast({
        description: 'タスクを作成しました',
      });

      onTaskCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        assignedTo: '',
        dueDate: '',
        estimatedHours: '',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description:
          error instanceof Error ? error.message : 'タスクの作成に失敗しました',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新しいタスクを作成</DialogTitle>
            <DialogDescription>
              プロジェクトに新しいタスクを追加します
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>タスク名</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={e =>
                  setFormData({...formData, title: e.target.value})
                }
                placeholder='タスク名を入力'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>説明</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={e =>
                  setFormData({...formData, description: e.target.value})
                }
                placeholder='タスクの説明を入力'
                rows={3}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='priority'>優先度</Label>
                <Select
                  value={formData.priority}
                  onValueChange={value =>
                    setFormData({...formData, priority: value})
                  }
                >
                  <SelectTrigger id='priority'>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='LOW'>低</SelectItem>
                    <SelectItem value='MEDIUM'>中</SelectItem>
                    <SelectItem value='HIGH'>高</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='assignedTo'>担当者</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={value =>
                    setFormData({...formData, assignedTo: value})
                  }
                >
                  <SelectTrigger id='assignedTo'>
                    <SelectValue placeholder='選択してください'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>未割り当て</SelectItem>
                    {members.map(member => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='dueDate'>期限</Label>
                <div className='relative'>
                  <Input
                    id='dueDate'
                    type='date'
                    value={formData.dueDate}
                    onChange={e =>
                      setFormData({...formData, dueDate: e.target.value})
                    }
                  />
                  <Calendar
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none'/>
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='estimatedHours'>見積時間</Label>
                <Input
                  id='estimatedHours'
                  type='number'
                  step='0.5'
                  min='0'
                  value={formData.estimatedHours}
                  onChange={e =>
                    setFormData({...formData, estimatedHours: e.target.value})
                  }
                  placeholder='時間'
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              キャンセル
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? '作成中...' : '作成'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
