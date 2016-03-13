var express = require('express');
var router = express.Router();
var multer  = require('multer');

var tracks_dir = process.env.TRACKS_DIR || './media/';

var trackController = require('../controllers/track_controller');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/tracks', trackController.list);

router.get('/tracks/new', trackController.new);

router.get('/tracks/new_playlist', trackController.new_playlist);

router.get('/tracks/playlist', trackController.list_playlist);

router.get('/tracks/:trackId', trackController.show);

router.get('/tracks/playlist/:playlistId', trackController.show_playlist);

router.post('/tracks', multer({inMemory: true}), trackController.create);

router.post('/tracks/add_playlist/:trackId', multer({inMemory: true}), trackController.add_playlist);

router.delete('/tracks/:trackId', trackController.destroy);

module.exports = router;