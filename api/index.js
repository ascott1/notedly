const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const authInit = require('./auth');
const authRoutes = require('./routes/auth');
const models = require('./models');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

// No need for async/await, Mongoose handles connection
mongoose.set('useNewUrlParser', true);
mongoose.connect(DB_HOST);
mongoose.connection.on('error', err => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

app.use(cors());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: DB_HOST,
      autoReconnect: true
    })
  })
);

// Authentication
authInit(models);
app.use(passport.initialize());
app.use(authRoutes);

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const user = req.session.user || '';
    // add the db models and the user to the context
    return { models, user };
  }
});

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:4000${server.graphqlPath}`
  )
);
