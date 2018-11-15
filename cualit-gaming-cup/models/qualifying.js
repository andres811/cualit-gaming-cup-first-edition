"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId

let QualifyingSchema = new Schema({
    races: [{
      track: String,
      participants: [{
        player: { type: ObjectId, ref: 'Player'},
        score: {type: Number, default: 0},
        normalized_score: {type: Number, default: 0}
      }]

    }]
});

module.exports = mongoose.model('Qualifying', QualifyingSchema);
