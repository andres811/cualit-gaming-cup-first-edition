var express = require('express');
var router = express.Router();
let _ = require('underscore')
let Player = require("../models/player")
let ObjectId = require('mongodb').ObjectID;
let teamHelper = require('../helpers/team-helper')
let scoreHelper = require('../helpers/score-helper')

/* GET players listing. */
router.get('/new', function(req, res, next) {
  return Player.find()
  .then(players => {
    res.render('warmup/new', { players: players, groups: teamHelper.buildWarpUpGroups(players)})
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
        score: parseInt(score),
        race: data[0]
      })
    }
  }
  Promise.all(scores.map((scoreData) => {
    return Player.findOne(ObjectId(scoreData.playerId))
    .then(p => {
      if(!p.warm_up_scores) p.warm_up_scores = []
      p.warm_up_scores.push(scoreHelper.normalizeScore(scoreData.score, _.max(scores.filter(s => s.race == scoreData.race), e => e.score).score))
      return p.save()
    })
  }))
  .then(()=> {
    return Player.find()
    .then(players => {
      res.render('warmup/new', { players: players, groups: teamHelper.buildWarpUpGroups(players)})
    })

  })
  .catch(err => {console.error(err)})
})

module.exports = router;
