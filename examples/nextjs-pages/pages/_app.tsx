import { useRouter } from 'next/router';
import { createPagesBrowserClient } from '@suplere/nhost-auth-helpers-nextjs';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps<{}>) {
	const router = useRouter();
	const nhost = createPagesBrowserClient();

	return (
		<>
			<button
				onClick={async () => {
					await nhost.auth.signOut();
					router.push('/');
				}}
			>
				Logout
			</button>

			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
