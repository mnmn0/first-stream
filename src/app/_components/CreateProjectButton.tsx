import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type React from 'react';

export interface CreateButtonProps {
  onClick: () => void;
}

export const CreateProjectButton: React.FC<CreateButtonProps> = ({
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      variant='ghost'
      size='sm'
      className='w-full flex items-center justify-start gap-2 px-2 py-1 text-muted-foreground hover:text-foreground'
    >
      <Plus size={16} />
      <span>Create New Project</span>
    </Button>
  );
};
