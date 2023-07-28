import { NhostClient } from '@nhost/nextjs';
import {
	BrowserCookieAuthStorageAdapter,
	CookieOptionsWithName,
	NhostNextClientConstructorParams,
	createNhostClient
} from '@suplere/nhost-auth-helpers-shared';

let nhost: any;

export function createClientComponentClient({
	options,
	cookieOptions,
	isSingleton = true
}: {
	options?: NhostNextClientConstructorParams;
	cookieOptions?: CookieOptionsWithName;
	isSingleton?: boolean;
} = {}): NhostClient {
	const subdomain = options?.subdomain || process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
	const region = options?.region || process.env.NEXT_PUBLIC_NHOST_REGION
	
	if (!subdomain ) {
		throw new Error(
			'either NEXT_PUBLIC_NHOST_SUBDOMAIN and NEXT_PUBLIC_NHOST_REGION env variables or subdomain and region are required!'
		);
	}

	const createNewClient = () =>
		createNhostClient({
			...options,
			auth: {
				storageKey: cookieOptions?.name,
				storage: new BrowserCookieAuthStorageAdapter(cookieOptions)
			},
			subdomain,
			region
		});

	if (isSingleton) {
		// The `Singleton` pattern is the default to simplify the instantiation
		// of a Supabase client across Client Components.
		const _nhost = nhost ?? createNewClient();
		// For SSG and SSR always create a new Supabase client
		if (typeof window === 'undefined') return _nhost;
		// Create the Supabase client once in the client
		if (!nhost) nhost = _nhost;
		return nhost;
	}
	
	return createNewClient();
}
