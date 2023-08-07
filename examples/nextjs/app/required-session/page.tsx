import { createServerComponentClient } from '@suplere/nhost-auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GET_POSTS } from '../../lib/graphql';

// this page will only be accessible to signed in users with a valid session
export default async function RequiredSession() {
	const nhost = await createServerComponentClient({ cookies });

	const session = nhost.auth.getSession();
	if (!session) {
		redirect('/');
	}

	const { data } = await nhost.graphql.request(GET_POSTS);

	return <pre>{JSON.stringify({ data }, null, 2)}</pre>;
}
