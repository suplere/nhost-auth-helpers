import { createServerComponentClient } from '@suplere/nhost-auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { INSERT_POST } from '../../lib/graphql';

export default async function NewPost() {
	

	const addPost = async (formData: FormData) => {
		'use server';
		const nhost = await createServerComponentClient({ cookies });
		const content = String(formData.get('content'));
		await nhost.graphql.request(INSERT_POST, {
			object: {
				content
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
