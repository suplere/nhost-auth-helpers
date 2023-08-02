import { gql } from '@apollo/client';

export const GET_POSTS = gql`
	query getPosts {
		posts {
			id
			content
			created_at
			updated_at
			user_id
		}
	}
`;

export const INSERT_POST = gql`
	mutation insertPost($object: posts_insert_input!) {
		insert_posts_one(object: $object) {
			id
			content
			created_at
			updated_at
			user_id
		}
	}
`;

export const SUBSCRIBE_ALL_POST = gql`
	subscription MySubscription {
		posts {
			id
			content
			created_at
			updated_at
			user_id
		}
	}
`;
