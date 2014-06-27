'use strict';

var mongoose = require('mongoose'),
    Board = mongoose.model('Board'),
    User = mongoose.model('User'),
    async = require('async'),
    _ = require('lodash');

module.exports = function(socketController) {
  return {
    /**
     * Create user
     */
    create: function (req, res, next) {
      var newBoard = new Board({
        name: req.body.name,
        creator: req.user.id
      });

      newBoard.save(function(err) {
        if (err) return res.json(400, err);
        return res.json(newBoard);
      });
    },

    /**
     * Get a board
     */
    show: function(req, res, next) {
      var boardId = req.params.id;

      Board.findById(boardId).populate('posts.creator creator').exec(function (err, board) {
        if (err) return next(err);
        if (!board) return res.send(404);
        if ( !(req.user.id === board.creator.id || req.user.isFriendsWith(board.creator.id)) ) return res.send(403); // Only allow access to boards that the user or his friends has created

        return res.json(board);
      });
    },

    /**
     * Get the logged in user's boards
     */
    mine: function(req, res, next) {
      Board.find({creator: req.user.id}, function (err, boards) {
        if (err) return next(err);
        return res.json(boards);
      });
    },

    /**
     * Get the logged in user's boards
     */
    addPost: function(req, res, next) {
      var boardId = req.params.id;

      Board.findById(boardId).exec(function (err, board) {
        if (err) return next(err);
        if (!board) return res.send(404);
        // TODO: Validate if user has access to board

        var newPost = {
          quote: req.body.quote,
          creator: req.user.id,
          imageUrl: req.body.s3url
        };

        board.posts.push(newPost);

        board.save(function(err, savedBoard) {
          if (err) return next(err);

          Board.populate(savedBoard, { path: 'posts.creator' }, function(err, savedBoard) {
            socketController.newPost(boardId, savedBoard.posts.pop()); // We send the newly saved post to the client with its mongo-generated id
          });

          return res.send(200);
        });
      });
    },

    joinableBoards: function(req, res, next) {
      req.user.getFriends(function(friends) {
        async.map(friends, function(friend, cb) {
          cb(null, socketController.roomsForUser(friend));
        }, function(err, boardIds) {
          async.map(_.flatten(boardIds), function(boardId, cb) {
            Board.findById(boardId).populate('creator').exec(function(err, board) {
              cb(null, board);
            });
          },
          function(err, boards) {
            res.json(boards);
          });
        });
      });
    }
  };
};