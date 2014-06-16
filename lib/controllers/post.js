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