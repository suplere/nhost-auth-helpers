import { GET_USERS } from '@/lib/graphql';
import { createPagesServerClient, User } from '@suplere/nhost-auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

export default function ProtectedPage({ user, data }: { user: User; data: any }) {
	return (
		<>
			<p>
				[<Link href="/">Home</Link>] | [<Link href="/profile">getServerSideProps</Link>]
			</p>
			<div>Protected content for {user?.email}</div>
			<p>server-side fetched data with RLS:</p>
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<p>user:</p>
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const nhost = await createPagesServerClient(ctx);
	// Check if we have a session
	const session = nhost.auth.getSession();

	if (!session)
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};

	// Run queries with RLS on the server
	const { data } = await nhost.graphql.request(GET_USERS);

	return {
		props: {
			initialSession: session,
			user: session.user,
			data: data ?? []
		}
	};
};
