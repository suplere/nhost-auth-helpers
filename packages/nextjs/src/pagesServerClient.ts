import { NhostClient } from '@nhost/nextjs';
import {
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	createNhostClient,
	parseCookies,
	serializeCookie,
	NhostNextClientConstructorParams
} from '@suplere/nhost-auth-helpers-shared';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { splitCookiesString } from 'set-cookie-parser';

class NextServerAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly context:
			| GetServerSidePropsContext
			| { req: NextApiRequest; res: NextApiResponse },
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		const setCookie = splitCookiesString(this.context.res.getHeader('set-cookie')?.toString() ?? '')
			.map((c) => parseCookies(c)[name])
			.find((c) => !!c);

		const value = setCookie ?? this.context.req.cookies[name];
		return value;
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
		const setCookies = splitCookiesString(
			this.context.res.getHeader('set-cookie')?.toString() ?? ''
		).filter((c) => !(name in parseCookies(c)));

		const cookieStr = serializeCookie(name, value, {
			...this.cookieOptions,
			...options,
			// Allow supabase-js on the client to read the cookie as well
			httpOnly: false
		});

		this.context.res.setHeader('set-cookie', [...setCookies, cookieStr]);
	}
}

export function createPagesServerClient(
	context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse },
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
			storage: new NextServerAuthStorageAdapter(context, cookieOptions)
		},
		subdomain,
		region
	});
}
