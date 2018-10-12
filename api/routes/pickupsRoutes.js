'use strict';

module.exports = function( app ){
  var manager = require( '../controllers/pickupsController' ),
    path = require( 'path' ),
    config = require( '../../config' );

  app.route( config.pickups_resource )
      .post( manager.create_pickup );

  app.route( config.pickups_resource+ '/:station' )
      .get( manager.list_all_pickups );

  app.route( config.pickups_resource+ '/:station/:resource_id' )
      .get( manager.list_pickup )
      .post( manager.update_entry )
      .options( manager.options_handler )
      .delete( manager.remove_entry );
}
