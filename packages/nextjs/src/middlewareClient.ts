import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NHOST_REFRESH_TOKEN_KEY, NhostClient, NhostSession } from '@nhost/nhost-js';
import { NhostNextClientConstructorParams } from './types';
import { NHOST_SESSION_KEY } from './utils';
import { createServerNhostClient } from './clients';

export async function createMiddlewareClient(
	context: { req: NextRequest; res: NextResponse },
	{
		options
	}: {
		options?: NhostNextClientConstructorParams;
	} = {}
): Promise<NhostClient> {
	const subdomain = options?.subdomain || process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
	const region = options?.region || process.env.NEXT_PUBLIC_NHOST_REGION;

	if (!subdomain) {
		throw new Error(
			'either NEXT_PUBLIC_NHOST_SUBDOMAIN and NEXT_PUBLIC_NHOST_REGION env variables or subdomain and region are required!'
		);
	}

	const session = context.req.cookies.get(NHOST_SESSION_KEY)?.value;
	const refreshToken = context.req.cookies.get(NHOST_REFRESH_TOKEN_KEY)?.value;
	const initialSession: NhostSession =
		session && refreshToken ? { ...JSON.parse(session), refreshToken } : undefined;

	return createServerNhostClient({
		...options,
		clientStorageType: 'custom',
		clientStorage: {
			getItem: (key: string) => {
				const urlKey = key === NHOST_REFRESH_TOKEN_KEY ? 'refreshToken' : key;
				const urlValue = context.req.nextUrl.searchParams.get(urlKey);
				// const cookieValue = Cookies.get(key) ?? null
				const nextCtxValue = context.req.cookies.get(key);
				return typeof urlValue === 'string' ? urlValue : nextCtxValue;
			},
			setItem: (key, value) => {},
			removeItem: (key) => {}
		},
		subdomain,
		region
	}, initialSession);
}
