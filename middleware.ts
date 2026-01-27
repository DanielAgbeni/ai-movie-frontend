import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes
const protectedRoutes = ['/dashboard', '/upload', '/settings'];

// Public routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isAuthenticated = request.cookies.has('isAuthenticated');

	// Redirect to login if accessing protected route without auth
	if (
		protectedRoutes.some((route) => path.startsWith(route)) &&
		!isAuthenticated
	) {
		const response = NextResponse.redirect(new URL('/login', request.url));
		// response.cookies.delete('isAuthenticated') // Ensure it's clean (optional)
		return response;
	}

	// Redirect to dashboard if accessing login/signup while authenticated
	if (authRoutes.some((route) => path.startsWith(route)) && isAuthenticated) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - logo.png (logo file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
	],
};
