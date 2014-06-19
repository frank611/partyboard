'use strict';

var passportSocketIo = require('passport.socketio'),
		config = require('./config/config'),
		_ = require('lodash');

module.exports = function(io, sessionStore) {

	// Passport setup

	function onAuthorizeSuccess(data, accept) {
	  console.log('successful connection to socket.io');
	  accept(null, true);
	}

	function onAuthorizeFail(data, message, error, accept) {
	  if (error) { throw new Error(message); }
	  console.log('failed connection to socket.io:', message);
	  accept(null, false);
	}

	io.use(passportSocketIo.authorize({
	  cookieParser: require('cookie-parser'),
	  key:         'connect.sid',
	  secret:      'angular-fullstack secret',
	  store:       sessionStore,
	  success:     onAuthorizeSuccess,
	  fail:        onAuthorizeFail,
	}));

	// Listeners

	io.on('connection', function(socket) {
		var user = socket.request.user;

		socket.on('joinBoard', function(boardId) {
			if (user.hasAccessToBoard(boardId)) {
				socket.join(boardId);
			}
		});
	});

	// Emitters

	var emitters = new function() {
		var self = this;

		this.newPost = function(boardId, post) {
			io.to(boardId).emit('newPost', post);
		};

		this.socketForUser = function(user, cb) {
			var sockets = io.of('/').connected;

			for (var socketId in sockets) {
				if (user.id === sockets[socketId].request.user.id) { return sockets[socketId]; }
			}
		};

		this.roomsForUser = function(user) {
			return self.socketForUser(user).rooms;
		};
	}();

	return emitters;
};