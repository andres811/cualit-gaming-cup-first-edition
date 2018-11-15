var express = require('express');
var router = express.Router();
let _ = require('underscore')
let Player = require("../models/player")
let Team = require("../models/team")
let Qualifying = require("../models/qualifying")
let ObjectId = require('mongodb').ObjectID;
let teamHelper = require('../helpers/team-helper')
let scoreHelper = require('../helpers/score-helper')
let raceHelper = require('../helpers/race-helper')
let asyncEach = require('../libs/async-each')

// update
router.post('/:id', function(req, res, next) {
  Qualifying.findOne(ObjectId(req.params.id)).populate('races.participants.player')
  .then(qualifying => {
    let newData = []
    _.each(req.body, (score, raceAndPlayerId) => {
      newData.push({race: raceAndPlayerId.split('_')[0], playerId: raceAndPlayerId.split('_')[1], score: parseInt(score)})
    })
    // order by race
    newData = _.groupBy(newData, d => {return d.race})
    _.each(newData, (datas, raceId) => {
      console.log(_.max(datas, d => d.score).score)
      let maxScore = _.max(datas, d => d.score).score
      _.each(datas, data => {
        _.each(qualifying.races[raceId].participants, (participant, i) => {
          if(ObjectId(data.playerId).equals(participant.player._id)){
            qualifying.races[raceId].participants[i].score = data.score
            qualifying.races[raceId].participants[i].normalized_score = scoreHelper.normalizeScore(data.score, maxScore)
          }
        })
      })
    })
    qualifying.save()

    res.render('qualifiers/new', {qualifying: qualifying})
  })
  .catch(e => {})
})

router.get('/:id', function(req, res, next) {
  Qualifying.findOne(ObjectId(req.params.id)).populate('races.participants.player')
  .then(qualifying => {
    res.render('qualifiers/new', {qualifying: qualifying})
  })
  .catch(e => {})
})

router.get('/new', function(req, res, next) {
  Team.find().populate('players')
  .then(teams => {
    playerQtyPerRace = 6
    numberOfRaces = 4
    races = []
    for(var i in teams) {
      let team = teams[i]
      if(team.players )
        team.players = team.players.shuffle()
    }
    for(var i = 0; i < numberOfRaces; i++) {
      let race = {participants: []}
      for(var j = 0; j < playerQtyPerRace; j++) {
        let team = teams[j]
        race.participants.push({player: team.players[i % team.players.length]})
        race.track = raceHelper.getRandomTrack()
      }
      races.push(race)
    }
    let qualifying = new Qualifying({races: races})
    return qualifying.save()
  })
  .then(qualifying => {
    res.render('qualifiers/new', {qualifying: qualifying})
  })
  .catch(e => {})
})

/* GET players listing. */
router.post('/', function(req, res, next) {

})

module.exports = router;
