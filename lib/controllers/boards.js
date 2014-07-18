'use strict';

var mongoose = require('mongoose'),
    Board = mongoose.model('Board'),
    User = mongoose.model('User'),
    async = require('async'),
    _ = require('lodash'),
    s3 = require('s3'),
    config = require('../config/config'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    rimraf = require('rimraf');

module.exports = function(socketController) {
  return {
    /**
     * Create user
     */
    create: function (req, res, next) {
      var newBoard = new Board({
        name: req.body.name,
        creator: req.user.id
      });

      newBoard.save(function(err) {
        if (err) return res.json(400, err);
        return res.json(newBoard);
      });
    },

    /**
     * Get a board
     */
    show: function(req, res, next) {
      var boardId = req.params.id;

      Board.findById(boardId).populate('posts.creator creator').exec(function (err, board) {
        if (err) return next(err);
        if (!board) return res.send(404);

        req.user.hasAccessToBoard(board, function(hasAccess) {
          if (!hasAccess) return res.send(403);
          return res.json(board);
        });
      });
    },

    /**
     * Get the logged in user's boards
     */
    mine: function(req, res, next) {
      Board.find({creator: req.user.id}, function (err, boards) {
        if (err) return next(err);
        return res.json(boards);
      });
    },

    /**
     * Get the logged in user's boards
     */
    addPost: function(req, res, next) {
      var boardId = req.params.id;

      Board.findById(boardId).exec(function (err, board) {
        if (err) return next(err);
        if (!board) return res.send(404);
        // TODO: Validate if user has access to board

        var newPost = {
          quote: req.body.quote,
          creator: req.user.id,
          s3Key: req.body.s3Key
        };

        board.posts.push(newPost);

        board.save(function(err, savedBoard) {
          if (err) return next(err);

          Board.populate(savedBoard, { path: 'posts.creator' }, function(err, savedBoard) {
            socketController.newPost(boardId, savedBoard.posts.pop()); // We send the newly saved post to the client with its mongo-generated id
          });

          return res.send(200);
        });
      });
    },

    joinableBoards: function(req, res, next) {
      req.user.getFriends(function(friends) {
        async.map(friends, function(friend, cb) {
          cb(null, socketController.roomsForUser(friend));
        }, function(err, boardIds) {
          async.map(_.flatten(boardIds), function(boardId, cb) {
            Board.findById(boardId).populate('creator').exec(function(err, board) {
              cb(null, board);
            });
          },
          function(err, boards) {
            res.json(boards);
          });
        });
      });
    },

    download: function(req, res, next) {
      var boardId = req.params.id;

      var s3 = require('s3');

      var client = s3.createClient({
        s3Options: {
          accessKeyId: config.s3.accessKey,
          secretAccessKey: config.s3.secretKey
        }
      });

      var picsDir = config.root + '/exports/' + boardId;

      var params = {
        localDir: picsDir,
        deleteRemoved: true,
        s3Params: {
          Bucket: config.s3.bucket,
          Prefix: boardId
        }
      };

      var downloader = client.downloadDir(params);

      downloader.on('error', function(err) {
        console.error("unable to sync:", err.stack);
      });
      downloader.on('progress', function() {
        console.log("progress", downloader.progressAmount, downloader.progressTotal);
      });
      downloader.on('end', function() {
        var zip = spawn('zip', ['-rj', '-', picsDir]);

        res.contentType('zip');

        // Keep writing stdout to res
        zip.stdout.on('data', function (data) {
          res.write(data);
        });

        zip.stderr.on('data', function (data) {
          // Uncomment to see the files being added
          //console.log('zip stderr: ' + data);
        });

        // End the response on zip exit
        zip.on('exit', function (code) {
          if(code !== 0) {
            res.statusCode = 500;
            console.log('zip process exited with code ' + code);
            res.end();
          } else {
            rimraf(picsDir, function() {});
            res.end();
          }
        });

      });
    }
  };
};