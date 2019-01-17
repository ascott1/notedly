const passport = require('passport');
const GitHubStrategy = require('passport-github2');

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id
  });
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
    (accessToken, refreshToken, profile, done) => {
      // TODO: async find or create user in DB and return that entry
      // return createOrFindUser(user, 'googleProviderId')
      //   .then(user => {
      //     done(null, user);
      //     return user;
      //   })
      //   .catch(err => {
      //     done(err);
      //     return null;
      //   });
      const user = profile;

      return done(null, user, accessToken, refreshToken);
    }
  )
);

module.exports = passport;
