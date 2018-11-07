'use strict';

var mongoose = require( 'mongoose' ),
  logger = require( '../../modules/logger' ),
  Pickups = mongoose.model( 'PickupModel' );

//POST config.pickups_resource/
exports.create_pickup = function( req, res ){
  var pickup = new Pickups( req.body );
  pickup.save( function( err, pk ){
    handleAnswer( res, req.originalUrl, err, pk, 201, 'Pickup Created', 'Entry could not be stored' );
  });
};

//GET config.pickups_resource/
exports.list_all_pickups = function( req, res ){
  Pickups.find( { status: { $in: [ "new", "in_progress" ] } }, function( err, pickups ){
      handleAnswer( res, req.originalUrl, err, pickups, 200, 'OK', 'Pickup list is empty' );
  });
};
//GET config.pickups_resource/:station
exports.list_pickups_by_station = function( req, res ){
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  Pickups.find( { created_date: {$gte: today}, station: req.params.station, status: { $in: [ "new", "in_progress", "completed" ] } }, function( err, pickups ){
      handleAnswer( res, req.originalUrl, err, pickups, 200, 'OK', 'Pickup list is empty' );
  });
};

//GET config.pickups_resource/:station/:resource_id
exports.list_pickup = function( req, res ){
  Pickups.findById( { _id: req.params.resource_id }, req.body, function( err, pickup ){
    handleAnswer( res, req.originalUrl, err, pickup, 200, 'OK', 'Pickup '+ req.params.resource_id +' does not exist' );
  });
};

//OPTIONS config.pickups_resource/:station/:resource_id
exports.options_handler = function( req, res ){
  res.setHeader( "Access-Control-Allow-Methods", "OPTIONS, DELETE, POST, GET" );
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.header( "Access-Control-Allow-Credentials", true );
  res.sendStatus( 200 );
};

//POST config.pickups_resource/:station/:resource_id
exports.update_entry = function( req, res ){
  Pickups.findOneAndUpdate( { _id: req.params.resource_id }, req.body, function( err, pickup ){
    handleAnswer( res, req.originalUrl, err, pickup, 200, 'Pickup Updated', 'Pickup '+ req.params.resource_id +' does not exist' );
  });
};

//DELETE config.pickups_resource/:station/:resource_id
exports.remove_entry = function( req, res ){
  Pickups.findByIdAndRemove( { _id: req.params.resource_id }, function( err, pickup ){
    handleAnswer( res, req.originalUrl, err, pickup, 200, 'Pickup Removed', 'Pickup '+ req.params.resource_id +' does not exist' );
  });
};

//DEFAULT FUNCTIONS
function handleAnswer( res, req_url, err, entry, http_code, positive_message, negative_message ){
  if( err ){
    http_code = err.errors ? 400 : 500;
    sendResponse( res, http_code, 2, 'Request could not be completed', req_url, entry, err );
  }else{
    if( entry == null ){
      sendResponse( res, 400, 1, negative_message, req_url, entry, err );
    }else{
      if( entry.length == 0 ){
        sendResponse( res, 404, 1, negative_message, req_url, entry, err );
      }else{
        sendResponse( res, http_code, 0, positive_message, req_url, entry, err );
      }
    }
  }
}

function sendResponse( res, http_code, response_code, response_message, url, entry, error ){
  try{
    if( http_code == 200 || http_code == 201 ){
      res.status( http_code ).json( { response_code: response_code, response_message: response_message, request_url: url, entry: entry, is_error: false } );
      error = '';
    }else{
      if( null === error )
        error = response_message;
      res.status( http_code ).send( { response_code: response_code, response_message: response_message, request_url: url, entry: entry, error: error, is_error: true } );
    }
  }catch( exception ){
    logger.warn( exception );
  }finally{
    logger.info( 'Responds '+ http_code + ':'+ response_code + '-' +response_message + '-' + error );
  }
}
