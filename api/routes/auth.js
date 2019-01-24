/*
 * Routes for authorization requests
 */

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
    // add the user to the session
    req.session.user = req.user;
    // Send the response
    // TODO: Redirect to the client
    res.send('Successful auth!');
  }
);

router.get('/logout', (req, res) => {
  req.session.destroy();
  // TODO: On successful logout
  // Redirect to the homepage of the client
  res.send('Logged out!');
});

module.exports = router;
