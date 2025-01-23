import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token');

  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
  matcher: ['/dashboard/:path*'],
};