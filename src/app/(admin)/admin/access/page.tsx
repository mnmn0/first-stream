'use client';

import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';

export default function AccessControlPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Access Control</h3>
        <p className='text-sm text-muted-foreground'>
          Configure access policies and roles for your organization.
        </p>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Administrator</TableCell>
              <TableCell>Full system access</TableCell>
              <TableCell>All permissions</TableCell>
              <TableCell>
                <Button variant='ghost' size='sm'>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Standard user access</TableCell>
              <TableCell>Limited permissions</TableCell>
              <TableCell>
                <Button variant='ghost' size='sm'>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
