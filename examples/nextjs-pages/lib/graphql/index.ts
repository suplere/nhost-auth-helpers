import { gql } from 'graphql-tag';

export const GET_USERS = gql`
  query getUsers {
    users {
      id
      metadata
      email
      displayName
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser($id: uuid!, $data: users_set_input) {
    updateUser(pk_columns: {id: $id}, _set: $data) {
      id
      metadata
      email
      displayName
    }
  }
`