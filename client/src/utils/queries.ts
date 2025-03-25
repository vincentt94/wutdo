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