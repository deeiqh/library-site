var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const wikiRouter = require('./routes/wiki');
const catalogRouter = require('./routes/catalog');

var app = express();

const mongoose = require('mongoose');
const mongooseDB = 'mongodb+srv://anyone:anyone@cluster0.e8yvd.mongodb.net/library?retryWrites=true&w=majority';
mongoose.connect(mongooseDB, {useNewURLParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', error => console.log('connection errorr'));

const Author = require('./models/author');
const Book = require('./models/book');
const BookInstance = require('./models/book-instance');
const Genre = require('./models/genre');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wiki', wikiRouter);
app.use('/catalog', catalogRouter);

// const async = require('async');
// function foo(cb) {
//   console.log('foooo');
//   cb('error', 'two');
// }
// async.series([
//   cb => foo(cb)
// ], (err, result) => err? console.log('error: ', err) : console.log('result: ', result));

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

module.exports = app;
