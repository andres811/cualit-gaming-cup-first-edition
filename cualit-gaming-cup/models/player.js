"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let PlayerSchema = new Schema({
    name:  {type: String, required: true},
    warm_up_scores: [{type: Number}]
});

module.exports = mongoose.model('Player', PlayerSchema);
