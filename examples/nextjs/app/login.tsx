'use client';

import { NhostSession, createClientComponentClient } from '@suplere/nhost-auth-helpers-nextjs';

export default function Login({ session }: { session: NhostSession | null }) {
	const nhost = createClientComponentClient({
		options: {
			subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
			region: process.env.NEXT_PUBLIC_NHOST_REGION
		}
	});

	const handleEmailLogin = async () => {
		const { error } = await nhost.auth.signIn({
			email: 'suplere@example.com',
			password: 'passwordpassword'
		});

		if (error) {
			console.log({ error });
		}
	};

	const handleGitHubLogin = async () => {
		const { error } = await nhost.auth.signIn({
			provider: 'github'
		});

		if (error) {
			console.log({ error });
		}
	};

	const handleLogout = async () => {
		const { error } = await nhost.auth.signOut();

		if (error) {
			console.log({ error });
		}
	};

	// this `session` is from the root loader - server-side
	// therefore, it can safely be used to conditionally render
	// SSR pages without issues with hydration
	return session ? (
		<button onClick={handleLogout}>Logout</button>
	) : (
		<>
			<button onClick={handleEmailLogin}>Email Login</button>
			<button onClick={handleGitHubLogin}>GitHub Login</button>
		</>
	);
}
