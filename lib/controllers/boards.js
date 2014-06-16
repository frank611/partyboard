'use strict';

var mongoose = require('mongoose'),
    Board = mongoose.model('Board'),
    User = mongoose.model('User');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newBoard = new Board({
    name: req.body.name,
    creator: req.user.id
  });

  newBoard.save(function(err) {
    if (err) return res.json(400, err);
    return res.json(newBoard);
  });
};

/**
 * Get a board
 */
exports.show = function(req, res, next) {
  var boardId = req.params.id;

  Board.findById(boardId, function (err, board) {
    if (err) return next(err);
    if (!board) return res.send(404);
    if (!board.creator.equals(req.user.id)) return res.send(403); // Only allow access to boards that the user has created

    return res.json(board);
  });
};

/**
 * Get the logged in user's boards
 */
exports.mine = function(req, res, next) {
  Board.find({creator: req.user.id}, function (err, boards) {
    if (err) return next(err);
    return res.json(boards);
  });
};