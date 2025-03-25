import { gql } from "@apollo/client";

export const GET_NOTES = gql`
  query GetNotes {
    getNotes {
      _id  
      title
      note
      imageUrl  
      username  
    }
  }
`;

export const USER_NOTES = gql`
  query GetUserNotes {
    getUserNotes {
      _id
      title
      note
      imageUrls
      username
    }
  }
`;


export const GET_NOTE_BY_ID = gql`
  query GetNoteById($id: ID!) {
    getNoteById(id: $id) {
      _id
      title
      note
      imageUrls
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($title: String!, $note: String!, $imageUrls: [String!]) {
    createNote(title: $title, note: $note, imageUrls: $imageUrls) {
      _id
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: ID!, $title: String!, $note: String!, $imageUrls: [String!]) {
    updateNote(id: $id, title: $title, note: $note, imageUrls: $imageUrls) {
      _id
    }
  }
`;