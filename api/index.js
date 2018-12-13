const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

async function start() {
  const app = express();
  let db;

  try {
    const client = await MongoClient.connect(
      DB_HOST,
      { useNewUrlParser: true }
    );
    db = client.db();
  } catch (error) {
    console.log(`
    
      Mongo DB Host not found!
      please add DB_HOST environment variable to .env file
      exiting...
       
    `);
    console.error(error);
    process.exit(1);
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return { db };
    }
  });

  server.applyMiddleware({ app, path: '/api' });

  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:4000${server.graphqlPath}`
    )
  );
}

start();
