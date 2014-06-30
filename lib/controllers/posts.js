'use strict';

var mongoose = require('mongoose'),
    https = require('https'),
    Board = mongoose.model('Board'),
    sig = require('amazon-s3-url-signer'),
    config = require('../config/config');

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

      var bucket = sig.urlSigner(config.s3.accessKey, config.s3.secretKey);
      var url = bucket.getUrl('GET', board.posts[0].s3Key, config.s3.bucket, 600);

      res.writeHead(302, {
        'Location': url,
        'Cache-Control': 'public, max-age=36000, must-revalidate'
      });
      res.send();
    });
  });
};