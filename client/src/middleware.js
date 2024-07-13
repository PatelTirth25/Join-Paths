import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  if (request.nextUrl.pathname === '/login') {
    if (request.cookies.get('next-auth.session-token')) {
      return NextResponse.redirect('http://localhost:3000/')
    }
  }
  if (request.nextUrl.pathname === '/jwt' || request.nextUrl.pathname === '/post' || request.nextUrl.pathname === '/newpost') {
    if (!request.cookies.get('next-auth.session-token')) {
      return NextResponse.redirect('http://localhost:3000/login')
    }
  }
  if (request.nextUrl.pathname === '/') {
    if (!request.cookies.get('next-auth.session-token')) {
      return NextResponse.redirect('http://localhost:3000/login')
    }
    return NextResponse.redirect('http://localhost:3000/profile')
  }

}

