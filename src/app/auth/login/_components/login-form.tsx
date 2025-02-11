'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export function LoginForm() {
  return (
    <div className='grid gap-6'>
      <Button variant='outline' type='button' onClick={() => signIn()}>
        Sign in with GitHub
      </Button>
    </div>
  );
}
