const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/auth/github/callback',
  passport.authenticate('github'),
  (req, res) => {
    req.session.userId = req.user.id;
    req.session.accessToken = req.user.accessToken;
    req.session.refreshToken = req.user.refreshToken;
    // TODO: On successful authentication
    // Redirect to the requesting URL of the correct client
    res.send('Successful auth!');
  }
);

router.get('/logout', (req, res) => {
  req.session.destroy();
  // TODO: On successful authentication
  // Redirect to the homepage of the client
  res.send('Logged out!');
});

module.exports = router;
