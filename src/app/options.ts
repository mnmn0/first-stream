import {prisma} from '@/lib/prisma';
import type {NextAuthOptions} from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const options: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    GitHubProvider({
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      clientId: process.env.GITHUB_ID!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // ユーザーが存在しない場合は作成
      const dbUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: account?.providerAccountId || '',
          email: user.email,
          name: user.name || '',
          imageUrl: user.image,
        },
      });

      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {email: user.email ?? ''},
          select: { id: true, isAdmin: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.isAdmin = dbUser.isAdmin;
        }
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          isAdmin: token.isAdmin,
        },
      };
    },
  },
};
