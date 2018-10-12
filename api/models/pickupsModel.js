'use strict';

var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var PickupSchema = new Schema( {
  request_type: {
    type: String,
    required: 'A request_type selection is required, [ pickup, delivery ]',
    enum: [ 'pickup', 'delivery' ],
    lowercase: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  station:{
    type: String,
    required: true,
    match: [ /MIA|NYC|ORD|LAX/, 'Station must match one of [MIA, ORD, NYC, LAX]' ]
  },
  pickup_name: {
    type: String,
    required: 'A name must be provided for the pickup request'
  },
  pickup_address: {
    type: String,
    required: 'A pickup address must be provided for the request'
  },
  cutoff_time: {
    type: String,
    required: true,
    match: [ /\d{2}:\d{2}/, 'Please specify the cutoff time for the pickup request [HH:MM]' ]
  },
  department: {
    type: String,
    required: 'Please specify the department requesting the pickup'
  },
  driver:{
    type: String
  },
  status:{
    type: String,
    enum: [ 'new', 'in progress', 'completed' ]
  }

});
module.exports = mongoose.model( 'PickupModel', PickupSchema );
