'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config');

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  console.log("trying to serialize:", user);
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        });
      }
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    // TODO: Put this in config file
    clientID: '903810586311957',
    clientSecret: 'd5da8958ad15abbf64e9a8c660ad0300',
    callbackURL: "http://" + config.url + "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    var callbackUser = {
      fbId: profile.id,
      accessToken: accessToken,
      name: profile.displayName
    };

    User.update({fbId: callbackUser.fbId}, callbackUser, {upsert: true}, function(err) {
      if (err) { return done(err); }

      User.findOne({fbId: callbackUser.fbId}, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      });
    });
  }
));

module.exports = passport;
