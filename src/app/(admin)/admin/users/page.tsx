'use client';

import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {useUser} from '@/hooks/use-user';
import {Users} from 'lucide-react';
import {Switch} from '@/components/ui/switch';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';

export default function AdminUsersPage() {
  const { data: users, isLoading, error, mutate } = useUser().users;
  const [userToUpdate, setUserToUpdate] = useState<string | null>(null);
  const { toast } = useToast();

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdmin: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      await mutate();
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      await mutate();
      toast({
        title: 'Success',
        description: 'User status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto py-6'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold'>User Management</h1>
        </div>
        <div className='space-y-4'>
          <div className='h-8 w-32 bg-muted animate-pulse rounded'/>
          <div className='h-64 w-full bg-muted animate-pulse rounded'/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto py-6'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold'>User Management</h1>
        </div>
        <div className='rounded-md bg-destructive/10 p-4'>
          <div className='flex items-center gap-3 text-destructive'>
            <Users className='h-5 w-5'/>
            <p>Failed to load users</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>User Management</h1>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={user.imageUrl ?? undefined} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.isAdmin}
                    onCheckedChange={() =>
                      handleToggleAdmin(user.id, user.isAdmin)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setUserToUpdate(user.id)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {user.isActive ? 'Deactivate User' : 'Activate User'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.isActive
                            ? 'This will prevent the user from accessing the system. Are you sure?'
                            : 'This will allow the user to access the system again. Are you sure?'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleToggleActive(user.id, user.isActive)
                          }
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
