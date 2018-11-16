"use strict";
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId
let Race = require('./race')
let _ = require('underscore')

let PlayoffSchema = new Schema({
    name: String,
    races: [Race.schema],
    teams: [{ref: 'Team', type: ObjectId}],
});

PlayoffSchema.methods.getTotals = function() {
    let totals = {}
    _.each(this.races, race => {
        let byTeam = _.groupBy(race.participants, participant => {
            return participant.team && participant.team.name
        })
        _.each(byTeam, (participants, team) => {
            if(!totals[team]) totals[team] = 0
            _.each(participants, participant => {
                totals[team] += participant.normalized_score
            })
        })
    })
    return totals
}

module.exports = mongoose.model('Playoff', PlayoffSchema);
