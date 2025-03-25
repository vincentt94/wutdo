import { gql } from '@apollo/client';


export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
      email
    }
    token
  }
}
`;

export const LOGIN_USER = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Note mutation
export const ADD_NOTE = gql`
  mutation AddNote($title: String!, $note: String!, $imageUrls: [String!]) {
    addNote(title: $title, note: $note, imageUrls: $imageUrls) {
      _id
      title
      note
      imageUrls
    }
  }
`;

// image upload
export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file)
  }
`;

//delete note mutation
export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;

//update note mutation
export const UPDATE_NOTE = gql`
  mutation UpdateNote($_id: ID!, $title: String!, $note: String!, $imageUrls: [String!]) {
    updateNote(_id: $_id, title: $title, note: $note, imageUrls: $imageUrls) {
      _id
      title
      note
      imageUrls
    }
  }
`;