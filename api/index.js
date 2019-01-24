const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const authInit = require('./auth');
const authRoutes = require('./routes/auth');
const initializeDatabase = require('./db');

const port = process.env.PORT || 4000;

initializeDatabase().then(db => {
  const app = express();

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

  // Authentication
  authInit(db);
  app.use(passport.initialize());
  app.use(authRoutes);

  // Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = req.session.user || '';
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
});
