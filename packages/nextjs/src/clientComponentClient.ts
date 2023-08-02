import { NhostClient } from '@nhost/nhost-js';
import { NhostNextClientConstructorParams } from './types';
import { NhostBrowserClient } from './clients';

let nhost: any;

export function createClientComponentClient({
	options,
	isSingleton = true,
}: {
	options?: NhostNextClientConstructorParams;
	isSingleton?: boolean;
} = {}): NhostClient {
	const subdomain = options?.subdomain || process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
	const region = options?.region || process.env.NEXT_PUBLIC_NHOST_REGION;

	if (!subdomain) {
		throw new Error(
			'either NEXT_PUBLIC_NHOST_SUBDOMAIN and NEXT_PUBLIC_NHOST_REGION env variables or subdomain and region are required!'
		);
	}

	const createNewClient = () =>
		{
			const nhost = new NhostBrowserClient({
				...options,
				autoSignIn: true,
				autoRefreshToken: true,
				subdomain,
				region
			});

			return nhost;
		};

	if (isSingleton) {
		// The `Singleton` pattern is the default to simplify the instantiation
		// of a NHost client across Client Components.
		const _nhost = nhost ?? createNewClient();
		// For SSG and SSR always create a new NHost client
		if (typeof window === 'undefined') return _nhost;
		// Create the NHost client once in the client
		if (!nhost) nhost = _nhost;
		return nhost;
	}

	return createNewClient();
}
