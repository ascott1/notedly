const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const auth = require('./auth');
const authRoutes = require('./routes/auth');

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

  app.use(cors());
  app.use(
    session({
      store: new MongoStore({
        db: db,
        touchAfter: 24 * 3600 // 1 day
      }),
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: true
    })
  );

  app.use(auth.initialize());
  app.use(authRoutes);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = '';

      console.log(req.session);

      // add the db and the user to the context
      return { db, user };
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
