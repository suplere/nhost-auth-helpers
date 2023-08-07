import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NHOST_REFRESH_TOKEN_KEY, NhostClient, NhostSession } from '@nhost/nhost-js';
import { NhostNextClientConstructorParams } from './types';
import { NHOST_SESSION_KEY, parseCookies, refresh, serializeCookie } from './utils';
import { createServerNhostClient } from './clients';
// import Cookies from 'js-cookie';

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

	const authURL = `https://${subdomain}.auth.nhost.run`
	let initialSession: NhostSession | undefined = undefined

	const refreshTokenInUrl = context.req.nextUrl.searchParams.get('refreshToken')

	if (refreshTokenInUrl) {
		try {
			initialSession = await refresh(authURL, refreshTokenInUrl)	
			if (initialSession) {
				const { refreshToken, ...rest } = initialSession
				const cookieStr = serializeCookie(NHOST_SESSION_KEY, JSON.stringify(rest), {
					sameSite: "strict",
					maxAge: initialSession.accessTokenExpiresIn - 60,
					// Allow nhost-js on the client to read the cookie as well
					httpOnly: false
				});
				context.res.headers.append('cookie', cookieStr);
				const tokenStr = serializeCookie(NHOST_REFRESH_TOKEN_KEY, refreshToken || "", {
					sameSite: "strict",
					maxAge: 60 * 69 * 24 * 30,
					// Allow nhost-js on the client to read the cookie as well
					httpOnly: false
				});
				context.res.headers.append('cookie', tokenStr);
			} 
		} catch (error) {
			
		}
	} else {
		const strSession = context.req.cookies.get(NHOST_SESSION_KEY)?.value;
		const refreshToken = context.req.cookies.get(NHOST_REFRESH_TOKEN_KEY)?.value
		initialSession = strSession &&
			refreshToken && { ...JSON.parse(strSession), refreshToken };
	}

	return createServerNhostClient(
		{
			...options,
			clientStorageType: 'custom',
			clientStorage: {
				getItem: (key: string) => {
					const cookies = parseCookies(context.req.headers.get('cookie') ?? '');
					return cookies[key];
				},
				setItem: (key, value) => {
					const cookieStr = serializeCookie(key, value, {
						sameSite: "strict",
						maxAge: 60 * 69 * 24 * 30,
						// Allow nhost-js on the client to read the cookie as well
						httpOnly: false
					});
					console.log("MIDDLEWARE CLIENT", key, value, cookieStr)
				},
				removeItem: (key) => {
					// Cookies.remove(key);
					const cookieStr = serializeCookie(key, "", {
						maxAge: 0,
						sameSite: "strict",
						// Allow nhost-js on the client to read the cookie as well
						httpOnly: false
					});
				
					if (context.res.headers) {
						context.res.headers.append('cookie', cookieStr);
					}
				}
			},
			start: false,
			autoRefreshToken: false,
			autoSignIn: true,
			subdomain,
			region
		},
		initialSession
	);
}
