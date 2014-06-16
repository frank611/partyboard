'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var PostSchema = new Schema({
  quote: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  board: { type: Schema.Types.ObjectId, ref: 'Board' }
});

module.exports = mongoose.model('Post', PostSchema);
