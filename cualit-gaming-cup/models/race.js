"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId

let RaceSchema = new Schema({
    track: String,
    participants: [{
        player: { type: ObjectId, ref: 'Player'},
        score: {type: Number, default: 0},
        normalized_score: {type: Number, default: 0},
        team: {type: ObjectId, ref: 'Team'}
    }]

});


module.exports = mongoose.model('Race', RaceSchema);
