import { createMiddlewareClient } from '@suplere/nhost-auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// this middleware refreshes the user's session and must be run
// for any Server Component route that uses `createServerComponentClient`
export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const nhost = await createMiddlewareClient({ req, res });

	nhost.auth.getSession();
	
	return res;
}
