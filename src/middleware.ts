import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (token.isEmployee) {
    const allowedRoutes = ['/billing'];
    const callbackUrl = '/billing';

    if (request.nextUrl.pathname !== callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    if (!allowedRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|auth).*)'],
};
