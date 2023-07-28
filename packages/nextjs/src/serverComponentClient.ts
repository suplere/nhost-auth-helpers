import { NhostClient } from '@nhost/nextjs';
import {
	CookieAuthStorageAdapter,
	CookieOptions,
	NhostNextClientConstructorParams,
	CookieOptionsWithName,
	createNhostClient
} from '@suplere/nhost-auth-helpers-shared';

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

class NextServerComponentAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly context: {
			cookies: () => ReadonlyRequestCookies;
		},
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		const nextCookies = this.context.cookies();
		return nextCookies.get(name)?.value;
	}
	protected setCookie(name: string, value: string): void {
		// Server Components cannot set cookies. Must use Middleware, Server Action or Route Handler
		// https://github.com/vercel/next.js/discussions/41745#discussioncomment-5198848
	}
	protected deleteCookie(name: string): void {
		// Server Components cannot set cookies. Must use Middleware, Server Action or Route Handler
		// https://github.com/vercel/next.js/discussions/41745#discussioncomment-5198848
	}
}

export function createServerComponentClient(
	context: {
		cookies: () => ReadonlyRequestCookies;
	},
	{
		options,
		cookieOptions
	}: {
		options?: NhostNextClientConstructorParams;
		cookieOptions?: CookieOptionsWithName;
	} = {}
): NhostClient {
	const subdomain = options?.subdomain || process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
	const region = options?.region || process.env.NEXT_PUBLIC_NHOST_REGION
	if (!subdomain) {
		throw new Error(
			'either NEXT_PUBLIC_NHOST_SUBDOMAIN and NEXT_PUBLIC_NHOST_REGION env variables or subdomain and region are required!'
		);
	}

	return createNhostClient(
		{
		...options,
		auth: {
			storageKey: cookieOptions?.name,
			storage: new NextServerComponentAuthStorageAdapter(context, cookieOptions)
		},
		subdomain,
		region
	});
}
