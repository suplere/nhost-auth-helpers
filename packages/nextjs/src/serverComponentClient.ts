import { NHOST_REFRESH_TOKEN_KEY, NhostClient, NhostSession } from '@nhost/nhost-js';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { createServerNhostClient } from './clients';
import { NhostNextClientConstructorParams } from './types';
import { NHOST_SESSION_KEY } from './utils';

export async function createServerComponentClient(
	context: {
		cookies: () => ReadonlyRequestCookies;
	},
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

	const session = context.cookies().get(NHOST_SESSION_KEY)?.value;
	const refreshToken = context.cookies().get(NHOST_REFRESH_TOKEN_KEY)?.value;
	const initialSession: NhostSession =
		session && refreshToken ? { ...JSON.parse(session), refreshToken } : undefined;


	return createServerNhostClient({
		...options,
		clientStorageType: 'custom',
		clientStorage: {
			getItem: (key) => {
				const cookieValue = context.cookies().get(key)?.value ?? null;
				return cookieValue;
			},
			setItem: (key, value) => {},
			removeItem: (key) => {}
		},
		start: false,
		autoRefreshToken: false,
		autoSignIn: true,
		subdomain,
		region
	}, initialSession);
}
