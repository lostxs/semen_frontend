import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request;

	const token = cookies.get('session')?.value;

	const isConversationPage = url.includes('/conversation');
	const isAuthPage = url.includes('/auth');

	if (token && isAuthPage) {
		return NextResponse.redirect(new URL('/conversation', url));
	}

	if (isAuthPage) {
		return NextResponse.next();
	}

	if (!token) {
		return NextResponse.redirect(new URL('/auth', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/conversation', '/auth', '/']
};
