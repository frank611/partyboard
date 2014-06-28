'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  ip: '0.0.0.0',
  port: process.env.PORT || 9000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  s3: {
    bucket: process.env.S3_BUCKET || 'partyboard',
    accessKey: process.env.AWS_ACCESS_KEY || 'AKIAJC3XGBPEBQ24WE3Q',
    secretKey: process.env.AWS_SECRET_KEY || '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'
  },
  url: process.env.URL || 'http://localhost:' + (process.env.PORT || 9000)
};