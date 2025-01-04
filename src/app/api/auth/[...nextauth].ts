import NextAuth from 'next-auth';
import AzureAD from 'next-auth/providers/azure-ad';

export const authOptions = {
  providers: [
    AzureAD({
      clientId: process.env.ENTRA_ID_CLIENT_ID!,
      clientSecret: process.env.ENTRA_ID_CLIENT_SECRET!,
    }),
  ],
};

export default NextAuth(authOptions);
