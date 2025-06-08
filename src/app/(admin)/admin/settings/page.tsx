'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Switch} from '@/components/ui/switch';
import {useToast} from '@/hooks/use-toast';

const settingsSchema = z.object({
  twoFactorAuth: z.boolean(),
  strongPasswords: z.boolean(),
  smtpServer: z.string().min(1, 'SMTP server is required'),
  smtpPort: z
    .string()
    .min(1, 'SMTP port is required')
    .regex(/^\d+$/, 'Must be a number'),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

export default function SystemSettingsPage() {
  const {toast} = useToast();
  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      twoFactorAuth: false,
      strongPasswords: true,
      smtpServer: '',
      smtpPort: '587',
    },
  });

  function onSubmit(data: SettingsSchema) {
    toast({
      title: 'Settings updated',
      description: 'Your system settings have been saved successfully.',
    });
    console.log(data);
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>System Settings</h3>
        <p className='text-sm text-muted-foreground'>
          Configure global system settings and preferences.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Configure security settings for your application.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='twoFactorAuth'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between space-x-2 rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Two-factor Authentication
                        </FormLabel>
                        <FormDescription>
                          Require 2FA for all users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='strongPasswords'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between space-x-2 rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Password Policy
                        </FormLabel>
                        <FormDescription>
                          Require strong passwords
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  Configure email settings for notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='smtpServer'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Server</FormLabel>
                      <FormControl>
                        <Input placeholder='smtp.example.com' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='smtpPort'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input placeholder='587' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <Button type='submit'>Save All Settings</Button>
        </form>
      </Form>
    </div>
  );
}
