import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    if (!token?.email) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // 管理者ページへのアクセスをチェック
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!token.isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/project/:path*',
    '/person/:path*',
    '/chart/:path*',
  ],
};
