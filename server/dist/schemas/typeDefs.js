const typeDefs = `
    scalar Upload
    
    type Note {
        _id: ID!
        title: String!
        note: String!
        imageUrl: String
        userId: ID!
        username: String
        createdAt: String
    }

    type User {
        _id: ID
        username: String
        email: String
        password: String
    }

    type Auth {
        token: ID!
        user: User
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        hello: String
        getNotes: [Note!]!
        getUserNotes: [Note!]!
        getUsers: [User]!
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        login(input: LoginInput!): Auth
        addNote(title: String!, note: String!, imageUrl: String): Note!
        uploadImage(file: Upload!): String!
    }
`;
export default typeDefs;
