'use strict';

var mongoose = require('mongoose'),
    Board = mongoose.model('Board');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newBoard = new Board(req.body);
  newBoard.save(function(err) {
    if (err) return res.json(400, err);
    return res.json(newBoard.toOject());
  });
};