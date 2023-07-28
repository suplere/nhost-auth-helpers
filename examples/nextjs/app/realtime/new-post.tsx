import { createServerComponentClient } from '@suplere/nhost-auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { INSERT_POST } from '../../lib/graphql';

export default function NewPost() {
	const nhost = createServerComponentClient({ cookies });

	const addPost = async (formData: FormData) => {
		'use server';
		const content = String(formData.get('content'));
		const user = nhost.auth.getUser()
		await nhost.graphql.request(INSERT_POST, {
			object: {
				content,
				user_id: user?.id
			} 
		});
	};

	return (
		<form action={addPost}>
			<input title='content' type="text" name="content" />
			<button>Save</button>
		</form>
	);
}
