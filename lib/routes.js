'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware'),
    passport = require('passport');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.get('/auth/facebook', passport.authenticate('facebook')); // Redirect the user to Facebook's login page
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/meow', failureRedirect: '/login' })); // Facebook calls back to this if a user has auth'd

  app.get('/meow', function(req, res) {res.json(req.user)});

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};