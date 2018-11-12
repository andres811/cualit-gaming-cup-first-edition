var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var playersRouter = require('./routes/players');
var warmupRouter = require('./routes/warmup');

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

let Player = require("./models/player")
let  p = new Player({name: "Andrés"})
//p.save()

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
