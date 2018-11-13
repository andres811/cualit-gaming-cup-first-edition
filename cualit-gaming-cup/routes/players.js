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

router.get('/new', function(req, res, next) {
  res.render('players/new')
});

router.post('/', function(req, res, next) {
  let names = req.body.name.split('\n').filter(n => !!n)
  let players = names.map(n => {return {name: n}})
  Player.insertMany(players)
  .then(p=> res.render('players/new'))
  .catch(e=>{})
})


module.exports = router;
