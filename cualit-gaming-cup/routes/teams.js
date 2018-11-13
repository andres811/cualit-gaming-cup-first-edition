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

module.exports = router;
