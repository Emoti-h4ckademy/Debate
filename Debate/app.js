var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var dbHandler         = require('./lib/dbHandler');

var app = express();

app.use(require('easy-livereload')());

//Initialize database
dbHandler.initializeDatabase(app, function (error) {
   if (error) {
       console.log ("Could not initialize database. Check if MongoDB service is up");
       process.exit(1);
   }else{
    require('./lib/imageProcessor');
   }
});

// helper included to debug handlebars values
var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    debug: function(value){
        console.log("Current Context");
        console.log("======================");
        console.log('value: ' + value);

        if(value) {
          console.log("Value");
          console.log("======================");
          console.log(value);
        }
     }
  }
});

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Setup routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/proyectos'));
app.use('/', require('./routes/trainings'));
app.use('/', require('./routes/persons'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
