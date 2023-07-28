import {
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	NhostNextClientConstructorParams,
	createNhostClient,
	parseCookies,
	serializeCookie,
} from '@suplere/nhost-auth-helpers-shared';
import { NextResponse } from 'next/server';
import { splitCookiesString } from 'set-cookie-parser';

import type { NextRequest } from 'next/server';
import { NhostClient } from '@nhost/nextjs';

class NextMiddlewareAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly context: { req: NextRequest; res: NextResponse },
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		const setCookie = splitCookiesString(
			this.context.res.headers.get('set-cookie')?.toString() ?? ''
		)
			.map((c) => parseCookies(c)[name])
			.find((c) => !!c);

		if (setCookie) {
			return setCookie;
		}

		const cookies = parseCookies(this.context.req.headers.get('cookie') ?? '');
		return cookies[name];
	}
	protected setCookie(name: string, value: string): void {
		this._setCookie(name, value);
	}
	protected deleteCookie(name: string): void {
		this._setCookie(name, '', {
			maxAge: 0
		});
	}

	private _setCookie(name: string, value: string, options?: CookieOptions) {
		const newSessionStr = serializeCookie(name, value, {
			...this.cookieOptions,
			...options,
			httpOnly: false
		});

		if (this.context.res.headers) {
			this.context.res.headers.append('set-cookie', newSessionStr);
			this.context.res.headers.append('cookie', newSessionStr);
		}
	}
}

export function createMiddlewareClient(
	context: { req: NextRequest; res: NextResponse },
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
	
	if (!subdomain ) {
		throw new Error(
			'either NEXT_PUBLIC_NHOST_SUBDOMAIN and NEXT_PUBLIC_NHOST_REGION env variables or subdomain and region are required!'
		);
	}

	return createNhostClient(
		{
		...options,
		auth: {
			storageKey: cookieOptions?.name,
			storage: new NextMiddlewareAuthStorageAdapter(context, cookieOptions)
		},
		subdomain,
		region
	});
}
