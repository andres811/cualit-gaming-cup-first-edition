"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId

let TeamSchema = new Schema({
    name:  {type: String, required: true},
    players: [{type: ObjectId, ref: 'Player'}],
    scores: [{
      qualifying: {ref: 'Qualifying', type: ObjectId},
      normalized_score: {type: Number, default: 0}
    }]
});

TeamSchema.methods.getTotalWarmUpScore = function() {
  return this.warm_up_scores.reduce((s1, s2) => s1 + s2, 0)
}

TeamSchema.methods.getTotalScore = function() {
    return (this.scores || []).reduce((s1, s2) => s1.value + s2.value, 0)
}

module.exports = mongoose.model('Team', TeamSchema);
