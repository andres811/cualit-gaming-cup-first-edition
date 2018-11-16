"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId

let TeamSchema = new Schema({
    name:  {type: String, required: true},
    players: [{type: ObjectId, ref: 'Player'}],
    scores: [{
      qualifying: {ref: 'Qualifying', type: ObjectId},
      team_normalized_score: {type: Number, default: 0},
      personal_scores: [{
        score: Number,
        normalized_score: Number,
        player: {ref: 'Player', type: ObjectId}
      }]
    }],
    race_player_counter: {type: Number, default: -1}
});

TeamSchema.methods.getTotalWarmUpScore = function() {
  return this.warm_up_scores.reduce((s1, s2) => s1 + s2, 0)
}

TeamSchema.methods.getTotalScore = function() {
    return (this.scores || []).map(s => s.team_normalized_score).reduce((s1, s2) => s1 + s2, 0)
}

TeamSchema.methods.getPlayerForRace = function() {
    this.race_player_counter ++
    return this.players[this.race_player_counter % this.players.length]
}

module.exports = mongoose.model('Team', TeamSchema);
