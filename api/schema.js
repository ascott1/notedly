const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Note {
    id: ID!
    content: String!
    htmlContent: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User!]
    createdAt: Date!
    updatedAt: Date!
  }

  type NoteFeed {
    page: Int!
    pages: Int!
    total: Int!
    notes: [Note!]!
  }

  type User {
    id: ID!
    name: String
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
  }

  type Query {
    singleNote(id: ID!): Note
    notes: [Note!]!
    noteFeed(page: Int): NoteFeed
    myNotes: [Note!]
    myFavorites: [Note!]
    userFavorites(id: ID!): [Note!]
    singleUser(id: ID!): User
    allUsers: [User!]!
    me: User!
  }

  type Mutation {
    newNote(content: String!): Note
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    toggleFavorite(id: ID!): Note
  }
`;

module.exports = typeDefs;
