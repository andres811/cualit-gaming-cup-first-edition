module.exports = {
  getRandomTrack: function() {
    var textArray = [
        'track1',
        'track2',
        'track3'
    ];
    var randomNumber = Math.floor(Math.random()*textArray.length);
    console.log(textArray[randomNumber])
    return textArray[randomNumber]
  }
}
