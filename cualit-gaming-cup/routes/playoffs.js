var express = require('express');
var router = express.Router();
let Player = require("../models/player")
let Team = require("../models/team")
let Playoff = require("../models/playoff")
let Race = require("../models/race")
let raceHelper = require("../helpers/race-helper")
let ObjectId = require('mongodb').ObjectID;
let _ = require('underscore')

/* GET players listing. */
router.get('/:id', function(req, res, next) {
    Playoff.findOne(ObjectId(req.params.id))
    .populate('races.participants.player')
    .populate('races.participants.team')
    .then(playoff => {
        res.render('playoffs/show', {playoff})
    })
    .catch(e => {

    })
});

router.get('/new/:team_id_1/:team_id_2', function(req, res, next) {
    let playoff
    Team.find({_id: {$in: [ObjectId(req.params.team_id_1), ObjectId(req.params.team_id_2)]}}).populate('players')
    .then(teams =>{
        if(!teams || teams.length !== 2) {throw new Error("Deben ser 2 equipos")}
        if(!teams[0].players || !teams[0].players.length || !teams[1].players || !teams[1].players.length) {throw new Error("Participantes insuficientes")}
        let numberOfRounds = 4
        let numberOfRaces = 2
        let numberOfTeamPlayersPerRace = 3
        let races = []

        for(let i = 0; i < numberOfRounds; i++) {
            let track = i < numberOfRaces ? raceHelper.getRandomTrack(): raceHelper.getRandomBattleTrack()
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
        playoff = new Playoff({races: races})

        return Promise.all(teams.map(team => team.save()))
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
