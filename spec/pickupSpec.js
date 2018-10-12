var request = require( 'request' ),
  config = require( '../config' );

var pickups_resource = config.pickups_resource;
var pickups_url = config.application_url + pickups_resource;

describe( pickups_resource + ' service tests', function(){
  describe( 'can create, read, update and delete entries '+ pickups_url, function(){

    var new_entry = { request_type: 'pickup', station: 'MIA', pickup_name: 'Juan Mayer', pickup_address: '1780 W 49th St Hialeah 33012', department: 'Operations', cutoff_time: '16:00' }
    var pickup_id;

    it( 'POST - creates a new entry ', function( done ){
        try{
          request.post( pickups_url, { json: new_entry, headers: { 'Content-Type' : 'application/json' } },
          function( error, response, body ){
            if( error ) throw error;
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 201 );
            expect( body.response_code ).toBe( 0 );
            expect( body.is_error ).toBe( false );
            expect( body.response_message ).toBe( "Pickup Created" );
            expect( body.request_url ).toBe( config.pickups_resource );
            expect( body.entry ).not.toBe( null );
            expect( body.entry._id ).not.toBe( null );
            expect( body.entry.request_type ).toBe( new_entry.request_type );
            expect( body.entry.station ).toBe( new_entry.station );
            expect( body.entry.pickup_name ).toBe( new_entry.pickup_name );
            expect( body.entry.pickup_address ).toBe( new_entry.pickup_address );
            expect( body.entry.department ).toBe( new_entry.department );
            expect( body.entry.cutoff_time ).toBe( new_entry.cutoff_time );
            expect( body.entry.created_date ).not.toBe( null );
            pickup_id = body.entry._id;
            done();
          });

        }catch( exc ){
          console.log( exc );
          done.fail();
        }
    });

    it( 'POST - updates an entry', function( done ){
      try{
        request.post( pickups_url+'/MIA/'+pickup_id, { json: { cutoff_time: '18:00' }, headers: { 'Content-Type' : 'application/json' } },
        function( error, response, body ){
          expect( response.statusCode ).toBe( 200 );
          expect( body.is_error ).toBe( false );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "Pickup Updated" );
          expect( body.request_url ).toBe( config.pickups_resource+"/MIA/"+pickup_id );
          expect( body.entry ).not.toBe( null );
          expect( body.entry._id ).toBe( pickup_id );
          expect( body.entry.request_type ).toBe( new_entry.request_type );
          expect( body.entry.station ).toBe( new_entry.station );
          expect( body.entry.pickup_name ).toBe( new_entry.pickup_name );
          expect( body.entry.pickup_address ).toBe( new_entry.pickup_address );
          expect( body.entry.department ).toBe( new_entry.department );
          expect( body.entry.cutoff_time ).toBe( new_entry.cutoff_time );
          expect( body.entry.created_date ).not.toBe( null );
          done();
        });

      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

    it( 'GET - reads all entries', function( done ){
      try{
        request.get( pickups_url+'/MIA/', { json: true },
        function( error, response, body ){
          expect( response.statusCode ).toBe( 200 );
          expect( body.is_error ).toBe( false );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "OK" );
          expect( body.request_url ).toBe( config.pickups_resource+"/MIA/" );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.length ).toBe( 1 );
          expect( body.entry[ 0 ] ).not.toBe( null );
          expect( body.entry[ 0 ]._id ).toBe( pickup_id );
          expect( body.entry[ 0 ].request_type ).toBe( new_entry.request_type );
          expect( body.entry[ 0 ].station ).toBe( new_entry.station );
          expect( body.entry[ 0 ].pickup_name ).toBe( new_entry.pickup_name );
          expect( body.entry[ 0 ].pickup_address ).toBe( new_entry.pickup_address );
          expect( body.entry[ 0 ].department ).toBe( new_entry.department );
          expect( body.entry[ 0 ].cutoff_time ).not.toBe( new_entry.cutoff_time );  //should be 18:00
          expect( body.entry[ 0 ].created_date ).not.toBe( null );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

    it( 'GET - reads an entry', function( done ){
      try{
        request.get( pickups_url+'/MIA/'+pickup_id, { json: true },
        function( error, response, body ){
          expect( response.statusCode ).toBe( 200 );
          expect( body.is_error ).toBe( false );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "OK" );
          expect( body.request_url ).toBe( config.pickups_resource+"/MIA/"+pickup_id );
          expect( body.entry ).not.toBe( null );
          expect( body.entry._id ).toBe( pickup_id );
          expect( body.entry.request_type ).toBe( new_entry.request_type );
          expect( body.entry.station ).toBe( new_entry.station );
          expect( body.entry.pickup_name ).toBe( new_entry.pickup_name );
          expect( body.entry.pickup_address ).toBe( new_entry.pickup_address );
          expect( body.entry.department ).toBe( new_entry.department );
          expect( body.entry.cutoff_time ).not.toBe( new_entry.cutoff_time );  //should be 18:00
          expect( body.entry.created_date ).not.toBe( null );
          done();
        });
      }catch( exc ){
        console.log( exc );
        done.fail();
      }
    });

    it( 'DELETE - removes an entry ', function( done ){
        try{
          request.delete( pickups_url+'/MIA/'+pickup_id, { json: true },
          function( error, response, body ){
            if( error ) throw error;
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.is_error ).toBe( false );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "Pickup Removed" );
            expect( body.request_url ).toBe( config.pickups_resource+"/MIA/"+pickup_id );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.request_type ).toBe( new_entry.request_type );
            expect( body.entry.station ).toBe( new_entry.station );
            expect( body.entry.pickup_name ).toBe( new_entry.pickup_name );
            expect( body.entry.pickup_address ).toBe( new_entry.pickup_address );
            expect( body.entry.department ).toBe( new_entry.department );
            expect( body.entry.cutoff_time ).toBe( '18:00' );
            expect( body.entry.created_date ).not.toBe( null );
            done();
          });

        }catch( exc ){
          console.log( exc );
          done.fail();
        }
    });
  });
});

describe( pickups_resource + ' failure service tests', function(){
  it( 'GET - list all empty read request', function( done ){
    try{
      request.get( pickups_url+'/MIA/', { json: true },
      function( error, response, body ){
        expect( response.statusCode ).toBe( 404 );
        expect( body.is_error ).toBe( true );
        expect( body.response_code ).toBe( 1 );
        expect( body.response_message ).toMatch( /is empty/ );
        expect( body.error ).toMatch( /is empty/ );
        expect( body.request_url ).toBe( config.pickups_resource+"/MIA/" );
        expect( body.entry ).not.toBe( null );
        expect( body.entry.length ).toBe( 0 );
        done();
      });
    }catch( exc ){
      console.log( exc );
      done.fail();
    }
  });

  it( 'GET - entry not found read request', function( done ){
    try{
      request.get( pickups_url+'/MIA/5bbf8940f4fb640396de1447', { json: true },
      function( error, response, body ){
        expect( response.statusCode ).toBe( 400 );
        expect( body.is_error ).toBe( true );
        expect( body.response_code ).toBe( 1 );
        expect( body.response_message ).toMatch( /does not exist/ );
        expect( body.error ).toMatch( /does not exist/ );
        expect( body.request_url ).toBe( config.pickups_resource+"/MIA/5bbf8940f4fb640396de1447" );
        expect( body.entry ).toBe( null );
        done();
      });
    }catch( exc ){
      console.log( exc );
      done.fail();
    }
  });

  it( 'GET - bad url request', function( done ){
    try{
      request.get( pickups_url, { json: true },
      function( error, response, body ){
        expect( response.statusCode ).toBe( 400 );
        expect( body.is_error ).toBe( true );
        expect( body.response_code ).toBe( 3 );
        expect( body.response_message ).toMatch( /does not exist/ );
        expect( body.request_url ).toBe( config.pickups_resource );
        expect( body.entry ).toBe( undefined );
        done();
      });
    }catch( exc ){
      console.log( exc );
      done.fail();
    }
  });

  describe( pickups_resource + ' failed validations', function(){
    var bad_entry = { station: 'MIA', pickup_name: 'Juan Mayer', pickup_address: '1780 W 49th St Hialeah 33012', department: 'Operations' }
    it( 'POST - fails to create a new entry ', function( done ){
        try{
          request.post( pickups_url, { json: bad_entry, headers: { 'Content-Type' : 'application/json' } },
          function( error, response, body ){
            if( error ) throw error;
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 400 );
            expect( body.response_code ).toBe( 2 );
            expect( body.is_error ).toBe( true );
            expect( body.response_message ).toMatch( /could not be completed/ );
            expect( body.request_url ).toBe( config.pickups_resource );
            expect( body.entry ).toBe( undefined );
            expect( body.error ).not.toBe( null );
            expect( body.error.errors ).not.toBe( null );
            expect( body.error.name ).toBe( "ValidationError" );
            expect( body.error._message ).toMatch( /validation failed/ );
            done();
          });

        }catch( exc ){
          console.log( exc );
          done.fail();
        }
    });
  });

});
