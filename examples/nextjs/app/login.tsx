'use client';

import { NhostSession, createClientComponentClient } from '@suplere/nhost-auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Login({ session }: { session: NhostSession | null }) {
	const router = useRouter()
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
		router.refresh()
	};

	const handleResetPassword = async () => {
		const { error } = await nhost.auth.resetPassword({
			email: "suplere@example.com",
			options: {
				redirectTo: "/required-session"
			}
		})

		if (error) {
			console.log({ error });
		}
	}

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
		router.refresh()
	};

	// this `session` is from the root loader  - server-side
	// therefore, it can safely be used to conditionally render
	// SSR pages without issues with hydration
	return session ? (
		<button onClick={handleLogout}>Logout</button>
	) : (
		<>
			<button onClick={handleEmailLogin}>Email Login</button>
			<button onClick={handleResetPassword}>Forgot password</button>
			<button onClick={handleGitHubLogin}>GitHub Login - not implemented</button>
		</>
	);
}
