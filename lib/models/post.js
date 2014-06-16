'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var BoardSchema = new Schema({
  quote: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Board', BoardSchema);
