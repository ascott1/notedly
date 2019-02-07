/*
 * Passport's OAuth Strategies
 */

const passport = require('passport');
const GitHubStrategy = require('passport-github2');

const gravatar = require('./util/gravatar');

const auth = models => {
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
          name: profile.displayName,
          userName: profile.username,
          providerId: profile.id,
          provider: profile.provider,
          email: (profile.emails.length > 0 && profile.emails[0].value) || null,
          avatar: gravatar(profile.emails[0].value)
        };

        // Find or create user in DB and return that entry
        try {
          const dbUser = await models.User.findOneAndUpdate(
            {
              providerId: user.providerId
            },
            {
              $set: user
            },
            {
              upsert: true,
              new: true
            }
          );
          done(null, dbUser);
        } catch (error) {
          done(error);
          return null;
        }
      }
    )
  );
};

module.exports = auth;
