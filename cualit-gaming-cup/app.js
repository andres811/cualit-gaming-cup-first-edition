var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var playersRouter = require('./routes/players');
var warmupRouter = require('./routes/warmup');
var teamsRouter = require('./routes/teams');
var qualifiersRouter = require('./routes/qualifiers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/players', playersRouter);
app.use('/warmup', warmupRouter);
app.use('/teams', teamsRouter);
app.use('/qualifiers', qualifiersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect('mongodb://localhost/cualit-gaming-cup', {
  server: {
    socketOptions: {
      socketTimeoutMS: 60000
    }
  }
});
var db = mongoose.connection;
var Promise = require('bluebird');
Promise.config({
    // Enable cancellation
    cancellation: true,
});
mongoose.Promise = Promise;
//mongoose.set('debug', true);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('successfully connected to mongodb');
});

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

Array.prototype.groupBy = function(prop) {
  return this.reduce(function(groups, item) {
    const val = item[prop]
    groups[val] = groups[val] || []
    groups[val].push(item)
    return groups
  }, {})
}

module.exports = app;


return

let Player = require('./models/player')
return Player.find()
.then(players => {


  //let playersNum = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
  let total = 0
  for(let i = 0; i < 6; i++) {
    total += players[i].getTotalScore()
  }
  let perfectGroupScore = total/6
  let playersNum = [0,1,2,3,4,5]
  let lastGrouping = []
  let minDiff = Infinity
  let perfectGroup

  var jsCombinatorics = require("js-combinatorics")
  let g = jsCombinatorics.cartesianProduct( playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum,playersNum )

  console.log(g.length)


  try {

  //grouping([], playersNum)
} catch(e){console.error(e)}
  function grouping(scores, playersNum, fixedPlayers) {
    console.log(scores, playersNum, fixedPlayers)
    scores = scores || []
    fixedPlayers = fixedPlayers || []
    if(playersNum.length === 0) {
      let diff = 0
      /*for(let k = 0; k < scores.length; k++) {
        diff += Math.abs(perfectGroupScore - scores[k])
        if(minDiff > diff) {
          minDiff = diff
          perfectGroup = fixedPlayers
        }
      }*/

      if(minDiff > diff) {
        minDiff = diff
        perfectGroup = fixedPlayers
      }
      return
    }

    let g = jsCombinatorics.bigCombination( playersNum  , 3 )
    for(var i = 0; i < g.length; i++) {
      let copyPlayersNum = playersNum.slice();

      let group = g.next()
      let totalGroupScore = 0
      for(var j = 0; j < 3; j++) {
        totalGroupScore += players[group[j]].getTotalScore()
        copyPlayersNum.splice(copyPlayersNum.indexOf(group[j]), 1)
      }
      if(!copyPlayersNum.length) {

        scores.push(totalGroupScore)
      }
      grouping(scores, copyPlayersNum, fixedPlayers.concat(group))

    }
  }
  console.log(minDiff, perfectGroup)
  return
  var places = [[0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17]]
  var teams = [0,0,0,0,0,0]
  var moving = 0

  for(var i = 0; i < 6; i++) {

  }
  for(var i in players) {
    var player = players[i]
  }
})
.catch(e => {})
