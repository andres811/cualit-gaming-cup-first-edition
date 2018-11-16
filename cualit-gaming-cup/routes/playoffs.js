var express = require('express');
var router = express.Router();
let Player = require("../models/player")
let Team = require("../models/team")
let Playoff = require("../models/playoff")
let Race = require("../models/race")
let raceHelper = require("../helpers/race-helper")
let scoreHelper = require("../helpers/score-helper")
let ObjectId = require('mongodb').ObjectID;
let _ = require('underscore')

router.post('/:id', function(req, res, next) {
    let newData = []
    let playersData = []
    let playoff
    Playoff.findOne(ObjectId(req.params.id))
    .populate('races.participants.player')
    .populate('races.participants.team')
    .populate('teams')
    .then(_playoff => {
        playoff = _playoff
        _.each(req.body, (score, raceAndPlayerId) => {
            newData.push({race: raceAndPlayerId.split('_')[0], playerId: raceAndPlayerId.split('_')[1], score: parseInt(score)})
        })
        // order by race
        let dataByRace = _.groupBy(newData, d => {return d.race})
        _.each(dataByRace, (datas, raceId) => {
            let maxScore = _.max(datas, d => d.score).score
            _.each(datas, data => {
                _.each(playoff.races[raceId].participants, (participant, i) => {
                    if(ObjectId(data.playerId).equals(participant.player._id)){
                        let normalizedScore = scoreHelper.normalizeScore(data.score, maxScore)
                        playersData.push({player: participant.player, normalizedScore: normalizedScore})
                        playoff.races[raceId].participants[i].score = data.score
                        playoff.races[raceId].participants[i].normalized_score = normalizedScore
                    }
                })
            })
        })
        return playoff.save()
    })
    .then(playoff => {
        res.render('playoffs/show', {playoff})
    })
    .catch(e => {
        console.error(e)
    })
})

/* GET players listing. */
router.get('/:id', function(req, res, next) {
    Playoff.findOne(ObjectId(req.params.id))
    .populate('races.participants.player')
    .populate('races.participants.team')
    .populate('teams')
    .then(playoff => {
        res.render('playoffs/show', {playoff})
    })
    .catch(e => {

    })
});

router.get('/new/:name/:team_id_1/:team_id_2/:rounds?', function(req, res, next) {
    let playoff
    Team.find({_id: {$in: [ObjectId(req.params.team_id_1), ObjectId(req.params.team_id_2)]}})
    .populate('players')
    .then(teams =>{
        if(!teams || teams.length !== 2) {throw new Error("Deben ser 2 equipos")}
        if(!teams[0].players || !teams[0].players.length || !teams[1].players || !teams[1].players.length) {throw new Error("Participantes insuficientes")}
        let numberOfRounds = req.params.rounds || 4
        let numberOfTeamPlayersPerRace = 3
        let races = []
        let types = []
        for(var l = 0; l < numberOfRounds; l++){
            if(l >= Math.floor(numberOfRounds/2)) {
                types.push('race')
            } else {
                if(l < Math.floor(numberOfRounds/4))
                    types.push('shine')
                else
                    types.push('glovo')
            }
        }
        types = types.shuffle()

        for(let i = 0; i < numberOfRounds; i++) {
            let trackType = types[i]
            let track
            if(trackType === 'race') {
                track = raceHelper.getRandomTrack()
            } else if(trackType === 'shine') {
                track = '(S) ' + raceHelper.getRandomBattleTrack()
            } else {
                track = '(B) ' + raceHelper.getRandomBattleTrack()
            }
            let participants = []

            for(let j = 0; j < 2; j++) {
                let team = teams[j]
                for(let k = 0; k < numberOfTeamPlayersPerRace; k++) {
                    let participant = {
                        player: team.getPlayerForRace(),
                        team: team
                    }
                    participants.push(participant)
                }
            }
            races.push(new Race({
                track: track,
                participants: participants
            }))
        }
        playoff = new Playoff({
            name: req.params.name,
            races: races,
            teams: teams
        })

        return Promise.all(teams.map(team => {
            team.playoff = playoff._id
            team.playoff_name = req.params.name
            return team.save()
        }))
    })
    .then(() => {
        return playoff.save()
    })
    .then(playoff => {
        res.render('playoffs/show', {playoff})
    })
    .catch(e => {
        console.error(e)
    })
});

module.exports = router;
