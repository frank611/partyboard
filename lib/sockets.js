'use strict';

var passportSocketIo = require('passport.socketio'),
		config = require('./config/config'),
		_ = require('lodash'),
		async = require('async');

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

				// Notify the user's friends that he has joined a board
				user.getFriends(function(friends) {
					async.each(friends, function(friend, cb) {
						var friendSocket = emitters.socketForUser(friend);

						if (!friendSocket) {
							return cb();
						}

						friendSocket.emit('friendStartedShowingBoard', 'allo');
						cb();
					});
				});
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

			return false;
		};

		this.roomsForUser = function(user) {
			var rooms = self.socketForUser(user).rooms;
			if (!rooms) { console.log('no rooms for user ' + user.name); return []; }

			return rooms.slice(1, rooms.length); // We remove the first socket.io room because it is a general room that everybody joins on connection
		};
	}();

	return emitters;
};