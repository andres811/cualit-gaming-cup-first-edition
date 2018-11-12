var express = require('express');
var router = express.Router();
let _ = require('underscore')
let Player = require("../models/player")
let ObjectId = require('mongodb').ObjectID;
let teamHelper = require('../helpers/team-helper')

/* GET players listing. */
router.get('/create', function(req, res, next) {
  Player.find()
  .then(players => {
    let playersQuantity = players.length
    let maxPlayersPerRace = 4
    let minPlayersPerRace = 3
    let surplusPlayersQuantity = playersQuantity % maxPlayersPerRace
    let numberOfRaces = Math.ceil(playersQuantity / maxPlayersPerRace)

    let groups = _.groupBy(players.shuffle(), (p, i) => (i % numberOfRaces)+1)
    res.render('warmup/create', { players: players, groups: groups})
  })
  .catch(e => {})
})

router.post('/', function(req, res, next) {
  let scores = []
  for(let name in req.body) {
    let data = name.split('_')
    let score = req.body[name]
    if(score && parseInt(score)) {
      scores.push({
        playerId: data[1],
        score: score,
        race: data[0]
      })
    }
  }
  console.log(_.max(scores.filter(s => s.race == '1'), e => e.score))
  return
  Promise.all(scores.map((scoreData) => {
    return Player.findOne(ObjectId(scoreData.playerId))
    .then(p => {
      if(!p.warm_up_scores) p.warm_up_scores = []
      p.warm_up_scores.push(scoreData.score)
      return p.save()
    })
  }))
  .then(()=> {
    return Player.find()
    .then(players => {
      res.render('warmup/create', { players: players, groups: teamHelper.buildWarpUpGroups(players)})
    })

  })
  .catch(err => {console.error(err)})
})

module.exports = router;
