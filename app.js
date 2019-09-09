const connection = require('./conf'); //a decommenter une fois conf.js configure
// ***** liste des modules installes + nodemon
const bodyParser = require("body-parser");
const cors = require('cors')
const express = require('express');
const morgan = require("morgan");
const mongoose = require('mongoose');


// Create global app object
const app = express();

const port = 3000;
app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(morgan("dev"));
app.use(morgan(":method :url :status :res[content-length] - :response-time "));

app.use(require('method-override')());

if (!isProduction) {
    app.use(errorhandler());
  }
  
  if(isProduction){
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    mongoose.connect('mongodb://localhost/conduit');
    mongoose.set('debug', true);
  }

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function(err, req, res, next) {
      console.log(err.stack);
  
      res.status(err.status || 500);
  
      res.json({'errors': {
        message: err.message,
        error: err
      }});
    });
  }
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: {}
    }});
  });

app.listen(port, (err) => {
    if (err) {
      throw new Error('Something bad happened...');
    };
    console.log(`Server is listening on port ${port}`);
  });