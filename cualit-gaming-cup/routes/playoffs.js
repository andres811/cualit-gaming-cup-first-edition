var express = require('express');
var router = express.Router();
let Player = require("../models/player")

/* GET players listing. */
router.get('/new', function(req, res, next) {

});

router.get('/:team_id_1/:team_id_2', function(req, res, next) {
    Player.find().populate('team')
    .then(players =>{
        res.render('players/index', { players: players.sort(function (a, b) {if(!a.team) return 0; if (a.team.name > b.team.name) { return 1; } if (a.team.name < b.team.name) {return -1;} return 0;})})
    })
    .catch(e => {

    })
});

module.exports = router;
