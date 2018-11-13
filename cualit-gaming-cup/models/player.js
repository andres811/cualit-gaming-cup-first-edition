"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let PlayerSchema = new Schema({
    name:  {type: String, required: true},
    warm_up_scores: [{type: Number}]
});

PlayerSchema.methods.getTotalScore = function() {
  return this.warm_up_scores.reduce((s1, s2) => s1 + s2, 0)
}

module.exports = mongoose.model('Player', PlayerSchema);
