var express = require( 'express' ),
  app = express(),
  bodyParser = require( 'body-parser' ),
  mongoose = require( 'mongoose' ),
  config = require( './config' ),
  logger = require( './modules/logger' ),
  Pickup = require( './api/models/pickupsModel' );

//dbsetup
mongoose.Promise = global.Promise;
var mongodb = config.environment === 'development' ? config.database_url_test : config.database_url;
mongoose.connect( mongodb, { useNewUrlParser: true } );

//Accept cross-origin browser requests
app.use( function( req, res, next ){
  res.setHeader( "Access-Control-Allow-Methods", "OPTIONS, DELETE, POST, GET" );
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.header( "Access-Control-Allow-Credentials", true );
  next();
});

//body-parser
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

//middleware for all requests
app.use( function( req, res, next ){
  var ip = req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress;
  logger.info( req.method + ' request to ' + req.originalUrl +' from: '+ ip + ' [' + JSON.stringify( req.body ) + ']');
  next(); // make sure we go to the next routes and don't stop here
});

//routes
var routes = require( './api/routes/pickupsRoutes' );
routes( app );

//handle bad requests
app.use( function( req, res ){
  res.status( 400 ).send( { response_code: 3, request_url: req.originalUrl, response_message: "The requested url does not exist.", is_error: true } );
});

app.listen( config.application_port );
logger.info( "Application: "+ config.application_name  );
logger.info( "Environment: "+ config.environment );
logger.info( "MongoDb: "+ mongodb );
logger.info( "Host: "+ config.application_url );
logger.info( "Services: "+ config.resources + " : " + config.pickups_resource );
