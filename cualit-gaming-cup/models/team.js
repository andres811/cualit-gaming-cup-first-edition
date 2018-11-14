"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId

let TeamSchema = new Schema({
    name:  {type: String, required: true},
    players: [{type: ObjectId, ref: 'Player'}]
});

TeamSchema.methods.getTotalScore = function() {
  return this.warm_up_scores.reduce((s1, s2) => s1 + s2, 0)
}

module.exports = mongoose.model('Team', TeamSchema);
