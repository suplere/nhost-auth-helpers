// pages/api/protected-route.ts
import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@suplere/nhost-auth-helpers-nextjs';
import { GET_USERS } from '@/lib/graphql';

const ProtectedRoute: NextApiHandler = async (req, res) => {
	// Create authenticated Supabase Client
	const nhost = await createPagesServerClient({ req, res });
	// Check if we have a session
	const session = nhost.auth.getSession();

	if (!session)
		return res.status(401).json({
			error: 'not_authenticated',
			description: 'The user does not have an active session or is not authenticated'
		});

	// Run queries with RLS on the server
	const { data } = await nhost.graphql.request(GET_USERS);
	res.json(data);
};

export default ProtectedRoute;
