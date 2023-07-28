import { createServerComponentClient } from '@suplere/nhost-auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { GET_POSTS } from '../../lib/graphql';

// this page will display with or without a user session
export default async function OptionalSession() {
	const nhost = createServerComponentClient({ cookies });
	const { data } = await nhost.graphql.request(GET_POSTS);

	return <pre>{JSON.stringify({ data }, null, 2)}</pre>;
}
