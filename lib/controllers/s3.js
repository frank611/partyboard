'use strict';

var config = require('../config/config');

/**
 * Get an url to upload a file to S3
 */
exports.sign = function(req, res) {
  var object_name = req.query.s3_object_name;
  var mime_type = req.query.s3_object_type;

  var now = new Date();
  var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
  var amz_headers = "x-amz-acl:public-read";

  var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/" + config.s3.bucket + "/"+object_name;

  var signature = crypto.createHmac('sha1', config.s3.secretKey).update(put_request).digest('base64');
  signature = encodeURIComponent(signature.trim());
  signature = signature.replace('%2B','+');

  var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

  var credentials = {
    signed_request: url + "?AWSAccessKeyId=" + config.s3.accessKey + "&Expires=" + expires + "&Signature=" + signature,
    url: url
  };

  res.json(credentials);
  res.end();
};