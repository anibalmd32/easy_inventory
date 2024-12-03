import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

const publicRoutes = ['/print/:id', '/auth'];
const allowedRoutes = ['/billing', '/billing/:id'];

function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) => {
    const routePattern = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`);
    return routePattern.test(pathname);
  });
}

function isAllowedRoute(pathname: string) {
  return allowedRoutes.some((route) => {
    const routePattern = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`);
    return routePattern.test(pathname);
  });
}

export async function middleware(request: NextRequest) {
  if (isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (token.isEmployee) {
    const callbackUrl = '/billing';

    if (!isAllowedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|auth).*)'],
};
