'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    boards = require('./controllers/boards'),
    posts = require('./controllers/posts'),
    session = require('./controllers/session'),
    s3 = require('./controllers/s3'),
    middleware = require('./middleware'),
    passport = require('passport');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/users')
    .post(users.create);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/boards')
    .post(boards.create);
  app.route('/api/boards/mine')
    .get(boards.mine);
  app.route('/api/boards/:id')
    .get(boards.show)
    .put(boards.addPost);

  app.route('/api/posts/:id/image')
    .get(posts.getImage);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_friends'] })); // Redirect the user to Facebook's login page for auth
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/boards', failureRedirect: '/' })); // Facebook calls back to this if a user has auth'd

  app.get('/api/s3Policy', s3.getS3Policy);

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