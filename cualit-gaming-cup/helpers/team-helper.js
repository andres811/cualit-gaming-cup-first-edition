/**let numberOfGroups = 6
let playersQuantity = players.length
let surplusPlayersQuantity = playersQuantity % numberOfGroups
console.log(surplusPlayersQuantity)
let groupMinSize = (playersQuantity - surplusPlayersQuantity) / numberOfGroups
let counters = []

for(var i = 0; i < numberOfGroups; i++) {
  for(var j = 0; j < groupMinSize; j++) {
    counters.push(i)
  }
}
for(var i = 0; i < surplusPlayersQuantity; i++) {
  counters.push(i)
}
let groups = _.groupBy(players.shuffle(), (p,i) => {
  return counters[i]
})
**/
let _ = require('underscore')

module.exports = {
  buildWarpUpGroups: function(players) {
    let playersQuantity = players.length
    let maxPlayersPerRace = 4
    let minPlayersPerRace = 3
    let surplusPlayersQuantity = playersQuantity % maxPlayersPerRace
    let numberOfRaces = Math.ceil(playersQuantity / maxPlayersPerRace)

    return _.groupBy(players.shuffle(), (p, i) => (i % numberOfRaces)+1)
  }
}
