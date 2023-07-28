import {
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	NhostNextClientConstructorParams,
	createNhostClient
} from '@suplere/nhost-auth-helpers-shared';

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { NhostClient } from '@nhost/nextjs';

class NextRouteHandlerAuthStorageAdapter extends CookieAuthStorageAdapter {
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
		const nextCookies = this.context.cookies();
		nextCookies.set(name, value);
	}
	protected deleteCookie(name: string): void {
		const nextCookies = this.context.cookies();
		nextCookies.set(name, '', {
			maxAge: 0
		});
	}
}

export function createRouteHandlerClient(
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

	return createNhostClient({
		...options,
		auth: {
			storageKey: cookieOptions?.name,
			storage: new NextRouteHandlerAuthStorageAdapter(context, cookieOptions)
		},
		subdomain,
		region
	});
}
