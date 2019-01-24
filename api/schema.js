const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Note {
    id: ID!
    content: String!
    htmlContent: String!
    author: User!
    favoriteCount: Int!
    # favoritedBy: [User!]
    created: Date!
    edited: Date!
  }

  type User {
    id: ID!
    name: String
    avatar: String
    #notes: [Note!]!
    #favorites: [Note!]!
    #following: [User!]!
  }

  type Query {
    singleNote(id: ID!): Note
    allNotes: [Note!]!
    myNotes(user: ID!): [Note!]
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    toggleReaction(noteID: ID!): Note
  }
`;

module.exports = typeDefs;
