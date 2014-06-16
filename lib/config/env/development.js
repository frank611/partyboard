'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: 'mongodb://localhost/fullstack-dev'
  },
  url: 'localhost:' + process.env.PORT || 9000
};