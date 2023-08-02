import { NHOST_REFRESH_TOKEN_KEY, NhostClient, NhostSession } from '@nhost/nhost-js';
import Cookies from 'js-cookie'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { NhostNextClientConstructorParams } from './types';
import { NHOST_SESSION_KEY } from './utils';
import { createServerNhostClient } from './clients';

export async function createPagesServerClient(
	context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse },
	{
		options,
	}: {
		options?: NhostNextClientConstructorParams;
	} = {}
): Promise<NhostClient> {
	const subdomain = options?.subdomain || process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
	const region = options?.region || process.env.NEXT_PUBLIC_NHOST_REGION
	
	if (!subdomain) {
		throw new Error(
			'either NEXT_PUBLIC_NHOST_SUBDOMAIN and NEXT_PUBLIC_NHOST_REGION env variables or subdomain and region are required!'
		);
	}

	const strSession = context.req.cookies[NHOST_SESSION_KEY]
  const refreshToken = context.req.cookies[NHOST_REFRESH_TOKEN_KEY]
  const initialSession: NhostSession = strSession &&
    refreshToken ? { ...JSON.parse(strSession), refreshToken } : undefined

	return createServerNhostClient({
		...options,
		clientStorageType: 'custom',
    clientStorage: {
      getItem: (key) => {
        const urlKey = key === NHOST_REFRESH_TOKEN_KEY ? 'refreshToken' : key
        const urlValue = (context as GetServerSidePropsContext).query[urlKey]
        const cookieValue = Cookies.get(key) ?? null
        const nextCtxValue = context.req.cookies[key]

        return typeof urlValue === 'string' ? urlValue : cookieValue ?? nextCtxValue
      },
      setItem: (key, value) => {
        Cookies.set(key, value, { httpOnly: false, sameSite: 'strict', expires: 30 })
      },
      removeItem: (key) => {
        Cookies.remove(key)
      }
    },
    start: false,
    autoRefreshToken: false,
    autoSignIn: true,
		subdomain,
		region
	}, initialSession);

}
