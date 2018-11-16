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


router.get('/new', function(req, res, next) {
  Team.find().populate('players')
  .then(_teams => {
    playerQtyPerRace = 6
    numberOfRaces = 4
    races = []
    let teams = []
    for(let i in _teams) {
      let team = _teams[i]
      if(team.players && team.players.length ) {
          team.players = team.players.shuffle()
          teams.push(team);
      }
    }
    for(let i = 0; i < numberOfRaces; i++) {
      let race = {participants: []}
      for(let j = 0; j < Math.min(playerQtyPerRace, teams.length); j++) {
        let team = teams[j]
        race.participants.push({player: team.getPlayerForRace(), team: team})
        race.track = raceHelper.getRandomTrack()
      }
      races.push(race)
    }
    let qualifying = new Qualifying({races: races})
    return qualifying.save()
  })
  .then(qualifying => {
    res.render('qualifiers/show', {qualifying: qualifying})
  })
  .catch(e => {
    console.error(e)
  })
})
// update
router.post('/:id', function(req, res, next) {
  let newData = []
  let playersData = []
  let qualifying
  Qualifying.findOne(ObjectId(req.params.id))
  .populate('races.participants.player')
  .populate('races.participants.team')
  .then(_qualifying => {
    qualifying = _qualifying
    _.each(req.body, (score, raceAndPlayerId) => {
      newData.push({race: raceAndPlayerId.split('_')[0], playerId: raceAndPlayerId.split('_')[1], score: parseInt(score)})
    })
    // order by race
    dataByRace = _.groupBy(newData, d => {return d.race})
    _.each(dataByRace, (datas, raceId) => {
      let maxScore = _.max(datas, d => d.score).score
      _.each(datas, data => {
        _.each(qualifying.races[raceId].participants, (participant, i) => {
          if(ObjectId(data.playerId).equals(participant.player._id)){
            let normalizedScore = scoreHelper.normalizeScore(data.score, maxScore)
            playersData.push({player: participant.player, normalizedScore: normalizedScore})
            qualifying.races[raceId].participants[i].score = data.score
            qualifying.races[raceId].participants[i].normalized_score = normalizedScore
          }
        })
      })
    })
    return qualifying.save()
  })
  .then(qualifying => {
    let teamsData = _.groupBy(playersData, d => {return d.player.team})
    return Team.find({_id: {$in: Object.keys(teamsData).map(id => ObjectId(id))}})
    .then(teams => {
        return Promise.all(teams.map(team => {
          let encontroONoControMijo = false
          let teamData = teamsData[team._id.toString()]
          let totalNormalizedScore = teamData.map(td => td.normalizedScore).reduce((s1,s2) => s1 + s2,0)
          let personalScores = teamData.map(td => {return {normalized_score: td.normalizedScore, player: td.player._id}})
          _.each(team.scores, (score, i) => {
            if(ObjectId(req.params.id).equals(score.qualifying)) {
              encontroONoControMijo = true
              team.scores[i].team_normalized_score = totalNormalizedScore
              team.scores[i].personal_scores = personalScores
            }
          })
          if(!encontroONoControMijo) {
            team.scores.push({
              team_normalized_score: totalNormalizedScore,
              qualifying: ObjectId(req.params.id),
              personal_scores: personalScores
            })
          }
          return team.save()
        }))
    })
    .catch(e => {
      console.error(e)
    })
  })
  .then(() => {

    res.render('qualifiers/show', {qualifying: qualifying})
  })
  .catch(e => {console.error(e)})
})

router.get('/:id', function(req, res, next) {
  Qualifying.findOne(ObjectId(req.params.id))
  .populate('races.participants.player')
  .populate('races.participants.team')
  .then(qualifying => {
    res.render('qualifiers/show', {qualifying: qualifying})
  })
  .catch(e => {console.error(e)})
})


/* GET players listing. */
router.post('/', function(req, res, next) {

})

module.exports = router;
