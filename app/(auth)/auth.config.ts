import { NextAuthConfig } from 'next-auth';

console.log(process.env.AUTH_GITHUB_ID);
console.log(process.env.AUTH_GITHUB_SECRET);
export const authConfig = {
  providers:[],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith('/task');
      const isOnRegister = nextUrl.pathname.startsWith('/signup');
      const isOnLogin = nextUrl.pathname.startsWith('/signin');

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl));
      }

      if (isOnRegister || isOnLogin) {
        return true;
      }

      if (isOnChat) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    }
  }
} satisfies NextAuthConfig;
