"use client";
import React, {useState} from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronsUpDown, X } from 'lucide-react';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// サンプルユーザーデータ
const members: Member[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: '/avatar1.png' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatar2.png' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: '/avatar3.png' },
];

interface Member {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  members: Member[];
  icon?: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps>  = ({ open, onOpenChange }: CreateProjectModalProps) => {
  const [memberSearchOpen, setMemberSearchOpen] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Omit<ProjectFormData, 'members'>>({
    name: '',
    description: '',
  });

  const toggleMember = (member: Member): void => {
    setSelectedMembers(current => {
      const exists = current.find(m => m.id === member.id);
      if (exists) {
        return current.filter(m => m.id !== member.id);
      }
      return [...current, member];
    });
  };

  const removeMember = (memberId: number): void => {
    setSelectedMembers(current => current.filter(m => m.id !== memberId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create a new project</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Projects are where your team organizes tasks, permissions, and members
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Icon Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                <span className="text-2xl">P</span>
              </div>
              <Button variant="outline" size="sm">
                Choose icon
              </Button>
            </div>
          </div>

          {/* Project Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Project name</label>
            <Input placeholder="Acme Project" />
          </div>

          {/* Description Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Details about your project"
              className="h-24 resize-none"
            />
          </div>

          {/* Member Assignment */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Members</label>
            <Popover open={memberSearchOpen} onOpenChange={setMemberSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={memberSearchOpen}
                  className="justify-between"
                >
                  Add members
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {members.map((member) => (
                        <CommandItem
                          key={member.id}
                          onSelect={() => {
                            toggleMember(member);
                            setMemberSearchOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm">{member.name}</span>
                              <span className="text-xs text-muted-foreground">{member.email}</span>
                            </div>
                          </div>
                          <Check
                            className={`ml-auto h-4 w-4 ${
                              selectedMembers.find(m => m.id === member.id)
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Members Display */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    {member.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeMember(member.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>
            Create project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { CreateProjectModalProps };  // 型をエクスポート
export default CreateProjectModal;
