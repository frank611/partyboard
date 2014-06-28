'use strict';

var mongoose = require('mongoose'),
    https = require('https'),
    Board = mongoose.model('Board');

/**
 * Proxy S3 image
 */
exports.getImage = function(req, res, next) {
  var postId = req.params.id;

  // Only return the post that we need from the board and filter to only gain access to boards where the user has contributed
  Board.findOne({ 'posts._id': postId }, {
    posts: {
      $elemMatch: {
        _id: postId
      }
    },
    creator: 1
  }).populate('posts.creator creator').exec(function (err, board) {
    if (err) return next(err);
    if (!board) return res.send(404);

    req.user.hasAccessToBoard(board, function(hasAccess) {
      if (!hasAccess) return res.send(403);

      https.get(board.posts[0].imageUrl, function(proxyRes) {
        res.setHeader('last-modified', proxyRes.headers['last-modified']);
        res.setHeader('date', proxyRes.headers.date);
        res.setHeader('content-type', proxyRes.headers['content-type']);
        res.setHeader('Cache-Control', 'public, max-age=' + (86400000*7));

        proxyRes.pipe(res);
      });
    });
  });
};