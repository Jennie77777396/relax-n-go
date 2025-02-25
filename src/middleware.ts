// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('----middleware----')
  const session = request.cookies.get('payload-token')

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Add matcher in config
export const config = {
  matcher: ['/dashboard/:path*'],
}
