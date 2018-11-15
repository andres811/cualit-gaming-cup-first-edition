var express = require('express');
var router = express.Router();
let _ = require('underscore')
let Player = require("../models/player")
let Team = require("../models/team")
let ObjectId = require('mongodb').ObjectID;
let teamHelper = require('../helpers/team-helper')
let scoreHelper = require('../helpers/score-helper')
let asyncEach = require('../libs/async-each')

/* GET players listing. */
router.post('/', function(req, res, next) {
  let newData = []
  _.each(req.body, (teamName, playerId) => {
    newData.push({team: teamName || 'remove', playerId: playerId})
  })
  newData = _.groupBy(newData, (d) => {
      return d.team || 'remove'
  })
  asyncEach(Object.keys(newData), (key, i, next)=> {

    return asyncEach(newData[key], (data, j, nextPlayer)=> {
      console.log(data)
        return Player.findOne(ObjectId(data.playerId))
        .then(p => {
          if(p && p.team) {
            // remove from old team
            return Team.findOneAndUpdate({_id: p.team}, {$pull: {'players': p._id}}).then(() => {
              return p
            })
          }
          return p
        })
        .then(p => {
          if(data.team == "remove") {
            p.team = undefined
            return p.save()
            .then((p,a)=> {
              console.log(p,a)
              return nextPlayer()
            })
          }
          return Team.findOneAndUpdate({name: data.team}, {$push: {'players': p}})
          .then((team,a,b,c) => {
            if(team) {
              p.team = team
              return p.save()
              .then(()=> {
                return nextPlayer()
              })
            } else {
              let team = new Team({name: data.team, players: [p]})
              return team.save()
              .then(team => {
                p.team = team._id
                return p.save()
                .then(()=> {
                  nextPlayer()
                })
              })
            }
          })
        })
      }, () => {
        next()
      })

  },() => {
    return res.redirect("players");
  })
})

router.get('/', function(req, res, next) {
  Team.find().populate('players')
  .then(teams => {
    _.each(teams, (team, i) => {
      _.each(team.players, (player, j) => {
        _.each(team.scores, (score, k) => {
          _.each(score.personal_scores, (personalScore, l) => {
            if(player._id.equals(personalScore.player)) {
              if(!team.players[j].scores) team.players[j].scores = []
              teams[i].players[j].scores.push(personalScore.normalized_score)
            }
          })
        })
      })
    })
    res.render('teams/index', {teams: teams.sort(t => t.getTotalScore() * -1)})
  })
  .catch(e => {console.error(e)})
})

module.exports = router;
