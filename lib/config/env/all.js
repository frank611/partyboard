'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../../..');

if (process.env.NODE_ENV === 'development') {
  var env = require('node-env-file');
  env(rootPath + '/.env');
}

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
    bucket: process.env.S3_BUCKET,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  },
  url: process.env.URL || 'http://localhost:' + (process.env.PORT || 9000)
};