var express = require('express');
var router = express.Router();
let Player = require("../models/player")

/* GET players listing. */
router.get('/', function(req, res, next) {
  Player.find().populate('team')
  .then(players =>{
      let pepe = players.sort(function (a, b) {
        if(!a.team) return 1;
        if(!b.team) return -1;
        if (a.team.name > b.team.name) { return 1; }
        if (a.team.name < b.team.name) {return -1;}
        return 0;
      })
      res.render('players/index', { players: players.sort(
          function (a, b) {
              if(!a.team) return 1;
              if(!b.team) return -1;
              if (a.team.name > b.team.name) return 1;
              if (a.team.name < b.team.name) return -1
              return 0;
          })
      })
  })
  .catch(e => {
    console.error(e)
  })
});

router.get('/new', function(req, res, next) {
  res.render('players/new')
});

router.post('/', function(req, res, next) {
  let names = req.body.name.split('\n').filter(n => !!n)
  let players = names.map(n => {return {name: n.replace('\r','')}})
  Player.insertMany(players)
  .then(p=> res.render('players/new'))
  .catch(e=>{})
})


module.exports = router;
