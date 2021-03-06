"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId
let Race = require('./race')

let QualifyingSchema = new Schema({
    races: [Race.schema]
});

module.exports = mongoose.model('Qualifying', QualifyingSchema);
