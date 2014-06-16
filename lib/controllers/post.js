'use strict';

var mongoose = require('mongoose'),
    Post = mongoose.model('Post');

/**
 * Create post
 */
exports.create = function (req, res, next) {
  var newPost = new Post(req.body);
  newPost.save(function(err) {
    if (err) return res.json(400, err);
    return res.json(newPost);
  });
};

/**
 * Get a post
 */
exports.show = function(req, res, next) {
  var postId = req.params.id;

  Post.findById(postId, function (err, post) {
    if (err) return next(err);
    if (!post) return res.send(404);

    return res.json(post);
  });
};
