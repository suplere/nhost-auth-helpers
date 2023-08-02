import { GET_USERS, UPDATE_USER } from '@/lib/graphql';
import {
	NhostSession,
	createPagesBrowserClient,
	createPagesServerClient
} from '@suplere/nhost-auth-helpers-nextjs';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Login({ user, session }: { user: User | null; session: NhostSession | null }) {
	const nhost = createPagesBrowserClient()

	const [data, setData] = useState<any>(null);

	useEffect(() => {
		async function loadData() {
			const { data } = await nhost.graphql.request(GET_USERS);
			if (data && data.users.length > 0) setData(data.users[0]);
		}
		console.log(user,nhost)
		if (user) loadData();
	}, [user, nhost]);

	return session ? (
		<>
			<p>
				[<Link href="/profile">getServerSideProps</Link>] | [
				<Link href="/protected-page">server-side RLS</Link>] |{' '}
				<button onClick={() => nhost.graphql.request(UPDATE_USER, { id: session.user.id, data: { metadata: { test: "update" } } })}>
					Update user metadata
				</button>
				<button onClick={() => nhost.auth.refreshSession()}>Refresh session</button>
			</p>
			<p>user:</p>
			<pre>{JSON.stringify(session, null, 2)}</pre>
			<p>client-side data fetching with RLS</p>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</>
	) : (
		<button
			onClick={() => {
				nhost.auth.signIn({
					email: 'suplere@example.com',
					password: 'passwordpassword'
				})
			}}
		>
			Login
		</button>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const nhost = await createPagesServerClient(ctx);

	const session  = nhost.auth.getSession();

	return {
		props: {
			session,
			user: session?.user ?? null
		}
	};
};
