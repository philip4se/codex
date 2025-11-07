import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  // 인증이 필요한 경로
  const protectedPaths = ['/requester', '/participant', '/api/surveys']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !token) {
    // API 요청인 경우
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }
    // 페이지 요청인 경우 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret)

      // 사용자 정보를 헤더에 추가
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId as string)
      requestHeaders.set('x-user-email', payload.email as string)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      // 토큰이 유효하지 않은 경우 쿠키 삭제
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/requester/:path*',
    '/participant/:path*',
    '/api/surveys/:path*',
  ],
}
