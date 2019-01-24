/*
 * Passport's OAuth Strategies
 */

const passport = require('passport');
const GitHubStrategy = require('passport-github2');
const UserModel = require('./models/user');

const auth = db => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = {
          githubToken: accessToken,
          providerId: profile.id,
          provider: profile.provider,
          name: profile.displayName,
          email: (profile.emails.length > 0 && profile.emails[0].value) || null,
          avatar: (profile.photos.length > 0 && profile.photos[0].value) || null
        };

        // Find or create user in DB and return that entry
        try {
          const dbUser = await UserModel.createOrFindUser(user, db);
          done(null, dbUser);
          return dbUser;
        } catch (error) {
          done(error);
          return null;
        }
      }
    )
  );
};

module.exports = auth;
