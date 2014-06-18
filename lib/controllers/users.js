'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    request = require('request');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);

    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 * Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  if (userId === 'me') { userId = req.user.id; }

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.json(user);
  });
};

/**
 * Get a user's Facebook profile picture url
 */
exports.picture = function (req, res, next) {
  var userId = req.params.id;
  if (userId === 'me') { userId = req.user.id; }

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    request.get({url: 'https://graph.facebook.com/me/picture?redirect=false&type=normal&access_token=' + user.accessToken, json: true },  function (err, response, pictureJson) {
      if (err) { return next(err); }
      res.redirect(pictureJson.data.url);
    });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};