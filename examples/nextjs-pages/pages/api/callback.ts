// pages/api/protected-route.ts
import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@suplere/nhost-auth-helpers-nextjs';

const callback: NextApiHandler = async (req, res) => {
	// Create authenticated Supabase Client
	const nhost = await createPagesServerClient({ req, res });

	const code = req.query.code;

	// if (typeof code === 'string') {
	// 	await nhost.auth.exchangeCodeForSession(code);
	// }

	res.redirect('/');
};

export default callback;
