var express = require('express');
var router = express.Router();
let Player = require("../models/player")

/* GET players listing. */
router.get('/', function(req, res, next) {
  Player.find()
  .then(players =>{

    res.render('players/index', { players: players});
  })
  .catch(e => {

  })
});

router.get('/create', function(req, res, next) {
  res.render('players/create')
});

router.post('/', function(req, res, next) {
  (new Player(req.body)).save().then(p=> res.render('players/create')).catch(e=>{})
})


module.exports = router;
