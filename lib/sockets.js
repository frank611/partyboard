'use strict';

var passportSocketIo = require('passport.socketio'),
		config = require('./config/config'),
		_ = require('lodash'),
		async = require('async'),
		Board = require('mongoose').model('Board');

module.exports = function(io, sessionStore) {

	// Passport setup

	function onAuthorizeSuccess(data, accept) {
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
		console.log(user.name + " has connected to socket.io");

		socket.on('joinBoard', function(boardId) {
			Board.findById(boardId).populate('posts.creator creator').exec(function(err, board) {
				if (err) return;

				user.hasAccessToBoard(board, function(hasAccess) {
					if (hasAccess) {
						socket.join(board._id.toString());

						// Notify the user's friends that he has joined a board
						user.getFriends(function(friends) {
							async.each(friends, function(friend, cb) {
								var friendSocket = emitters.socketForUser(friend);

								if (!friendSocket) {
									return cb();
								}

								friendSocket.emit('refreshJoinableBoards');
								cb();
							});
						});
					}
				});
			});
		});

		socket.on('leaveBoard', function(boardId) {
			socket.leave(boardId);

			// Notify the user's friends that he left a board
			user.getFriends(function(friends) {
				async.each(friends, function(friend, cb) {
					var friendSocket = emitters.socketForUser(friend);

					if (!friendSocket) {
						return cb();
					}

					friendSocket.emit('refreshJoinableBoards');
					cb();
				});
			});
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
				if (user._id.equals(sockets[socketId].request.user._id)) return sockets[socketId];
			}

			return false;
		};

		this.roomsForUser = function(user) {
			var rooms = self.socketForUser(user).rooms;
			if (!rooms) return [];

			return rooms.slice(1, rooms.length); // We remove the first socket.io room because it is a general room that everybody joins on connection
		};
	}();

	return emitters;
};