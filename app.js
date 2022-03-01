var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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
app.use('/users', usersRouter);

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

//mongoose
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const author = require('./models/author');
const mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewURLParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MondoDB connection errorr'));


const Schema = mongoose.Schema;
const schema = new Schema({
  name: String,
  binary: Buffer,
  age: {type: Number, min: 0, max: 200, required: false},
  fruits: [String],
  mixed: Schema.Types.Mixed,
  //_id: Schema.Types.ObjectId,
  nested: {stuff: {type: String, lowercase: true, trim: true}},
  music: {type: String, default: 'rock'},
  pounds: {
    type: Number,
    min: [1, 'can not be 0, at least 1'],
    max: 3,
    required: [false, 'is not mandatory']
  },
  vegetables: {
    type: String,
    enum: ['apple', 'orange', 'grape'],
    min: 1,
    required: true
  }
})

const Model = mongoose.model('Model', schema);

const orange = new Model({vegetables: 'orange'});
orange.save(err => {
  if (err) return console.log(err, 'orange errr');
});

Model.create({vegetables: 'apple'}, (err, apple) => {
  if (err) console.log('apple errr');
});

console.log(orange.vegetables);
orange.vegetables = 'grape';
orange.save( err => {
  if (err) console.log('orange errr');
});

Model.find({vegetables: 'orange'}, 'vegetables', (err, results) => {
  if (err) { 
    console.log('find errorr'); 
    return;
  }
  console.log(results);
})

const query = Model.find({vegetables: 'apple'});
query.select('vegetables');
query.limit(5);
query.sort({vegetables: -1});
query.exec((err, results) => {
  if (!err) console.log(results);
});

Model
  .find()
  .where('vegetable').equals('apple')
  .limit(5)
  .sort({vegetables: -1})
  .select('vegetables')
  .exec((err, results) => console.log(results));

Model.
  findOne()
  .where('vegetables').equals('orange')
  .count()
  .exec((err, results) => console.log(results));


const Author = require('./models/author');
const Story = require('./models/story');

const julius = new Author({
  name: 'Julius'
});

julius.save(err => {
  if (err) console.log('author julius creation error');
  else {
    const aWorldFor = new Story({
      title: 'A world for', 
      author: julius._id
    });
    aWorldFor.save(err => console.log('error creating story'));
  }
});

Story
  .find()
  .where('author').equals(julius._id)
  .select('title')
  .exec((err, stories) => console.log(stories));


module.exports = app;
