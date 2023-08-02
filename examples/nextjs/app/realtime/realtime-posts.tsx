'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@suplere/nhost-auth-helpers-nextjs';
import { createApolloClient } from "@nhost/apollo"
import { useSubscription } from '@apollo/client';
import { SUBSCRIBE_ALL_POST } from '../../lib/graphql';

// realtime subscriptions need to be set up client-side
// this component takes initial posts as props and automatically
// updates when new posts are inserted into Nhost's `posts` table
export default function RealtimePosts({ serverPosts }: { serverPosts: Post[] }) {
	const [posts, setPosts] = useState(serverPosts);
	const nhost = createClientComponentClient()
	const apolloClient = createApolloClient({
		nhost
	})

	// const {data} = useSubscription(SUBSCRIBE_ALL_POST, {client: apolloClient})

	const subs = apolloClient.subscribe({
		query: SUBSCRIBE_ALL_POST,
	})

	subs.subscribe({
		error: (e) => console.log(e),
		next: x => setPosts(x.data.posts)
	})

	useEffect(() => {
		// this overwrites `posts` any time the `serverPosts` prop changes
		// this happens when the parent Server Component is re-rendered
		setPosts(serverPosts);
	}, [serverPosts]);

	// useEffect(() => {
	// 	// ensure you have enabled replication on the `posts` table
	// 	// https://app.supabase.com/project/_/database/replication
	// 	const channel = supabase
	// 		.channel('*')
	// 		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) =>
	// 			setPosts([...posts, payload.new as Post])
	// 		)
	// 		.subscribe();

	// 	return () => {
	// 		supabase.removeChannel(channel);
	// 	};
	// }, [supabase, setPosts, posts]);

	// useEffect(() => {
	// 	if (subs) {
	// 		const subscribe = subs.subscribe(x => {
	// 			console.log(x);
	// 		})
	// 	}
		
	// }, [subs])

	return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
