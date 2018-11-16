module.exports = {
  getRandomTrack: function() {
    var textArray = [
        'track1',
        'track2',
        'track3'
    ];
    var randomNumber = Math.floor(Math.random()*textArray.length);
    return textArray[randomNumber]
  },
  getRandomBattleTrack: function() {
      var textArray = [
          'trackBattle1',
          'trackBattle2',
          'trackBattle3'
      ];
      var randomNumber = Math.floor(Math.random()*textArray.length);
      return textArray[randomNumber]
  }
}
