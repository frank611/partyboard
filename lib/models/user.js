'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    FB = require('fb');

var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  fbId: { type: String, unique: true },
  accessToken: String
  // hashedPassword: String,
  // salt: String
});

// Override the toJSON to exclude the accessToken
UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.accessToken;
    return ret;
  }
});

/**
 * Virtuals
 */

// UserSchema
//   .virtual('password')
//   .set(function(password) {
//     this._password = password;
//     this.salt = this.makeSalt();
//     this.hashedPassword = this.encryptPassword(password);
//   })
//   .get(function() {
//     return this._password;
//   });

// // Basic info to identify the current authenticated user in the app
// UserSchema
//   .virtual('userInfo')
//   .get(function() {
//     return {
//       'name': this.name,
//       'provider': this.provider
//     };
//   });

// // Public profile information
// UserSchema
//   .virtual('profile')
//   .get(function() {
//     return {
//       'name': this.name
//     };
//   });

/**
 * Validations
 */

// // Validate empty email
// UserSchema
//   .path('email')
//   .validate(function(email) {
//     // if you are authenticating by any of the oauth strategies, don't validate
//     if (authTypes.indexOf(this.provider) !== -1) return true;
//     return email.length;
//   }, 'Email cannot be blank');

// // Validate empty password
// UserSchema
//   .path('hashedPassword')
//   .validate(function(hashedPassword) {
//     // if you are authenticating by any of the oauth strategies, don't validate
//     if (authTypes.indexOf(this.provider) !== -1) return true;
//     return hashedPassword.length;
//   }, 'Password cannot be blank');

// // Validate email is not taken
// UserSchema
//   .path('email')
//   .validate(function(value, respond) {
//     var self = this;
//     this.constructor.findOne({email: value}, function(err, user) {
//       if(err) throw err;
//       if(user) {
//         if(self.id === user.id) return respond(true);
//         return respond(false);
//       }
//       respond(true);
//     });
// }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
// UserSchema
//   .pre('save', function(next) {
//     if (!this.isNew) return next();

//     if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
//       next(new Error('Invalid password'));
//     else
//       next();
//   });

/**
 * Methods
 */
UserSchema.methods = {

   /**
   * Checks if the user has access to a certain board
   *
   * @param {Function} cb
   * @api public
   */
  hasAccessToBoard: function(boardId) {
    // TODO: check if the owner of the board is one of his friends
    return true;
  },

  /**
   * Return the list of the user's Facebook friends that have already logged in to the app
   *
   * @param {Function} cb
   * @api public
   */
  getFriends: function(cb) {
    FB.setAccessToken(this.accessToken);

    FB.api('/' + this.fbId + '/friends', function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }

      cb(res.data);
    });
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
