/* http://www.lucaongaro.eu/blog/2012/12/02/easy-two-way-data-binding-in-javascript/
 *
 */
function DataBinder( object_id ) {
	// Use a jQuery object as simple PubSub
	var pubSub = jQuery({});

	// We expect a `data` element specifying the binding
	// in the form: data-bind-<object_id>="<property_name>"
	var data_attr = "bind-" + object_id,
		message = object_id + ":change";

	// Listen to change events on elements with the data-binding attribute and proxy
	// them to the PubSub, so that the change is "broadcasted" to all connected objects
	jQuery( document ).on( "change", "[data-" + data_attr + "]", function( evt ) {
		var $input = jQuery( this );
		var value = $input.is("input, textarea, select") ? $input.val() : $input.html();

		pubSub.trigger( message, [ $input.data( data_attr ), value ] );
	});

	// PubSub propagates changes to all bound elements, setting value of
	// input tags or HTML content of other tags
	pubSub.on( message, function( evt, prop_name, new_val ) {
		jQuery( "[data-" + data_attr + "=" + prop_name + "]" ).each( function() {
			var $bound = jQuery( this );
			if ( $bound.is("input, textarea, select") ) {
				$bound.val( new_val );
			} else {
				$bound.html( new_val );
			}
		});
	});
	return pubSub;
}

//Binder object
function BindObject( uid ) {
	var binder = new DataBinder( uid ),

	set = {
		attributes: {},
    attributes_display: {}, // used to create forms  Everything is a text input unless an entry is made here
		// The attribute setter publish changes using the DataBinder PubSub
		set: function( attr_name, val ) {
			this.attributes[ attr_name ] = val;
			binder.trigger( uid + ":change", [ attr_name, val, this ] );
		},
		get: function( attr_name ) {
			return this.attributes[ attr_name ];
		},
		safeget: function( attr_name ) {
			return [ this.attributes[ attr_name ] ].join( '' );
		},
		load: function( obj ){
			for (var property in obj ) {
				if( obj[ property ] ){
					this.set( property, obj[ property ] );
				}
			}
		},
		reset: function(){
			for (var property in this.attributes) {
				if ( this.attributes.hasOwnProperty( property ) ) {
					this.set( property, undefined );
				}
			}
		},
		destroy: function(){
			this.reset();
			this.attributes = {};
		},
		copy: function(){
			return JSON.parse( this.toString() );
		},
		toString: function(){
			return JSON.stringify( this.attributes );
		},
    //Form builder selection
    toTitleCase: function( str ) {
        return str.replace( "_", " " ).replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
		toAttributeArray: function( items ){
			var array = [];
			var t = this;
			items.forEach( function( e ){
				array.push( t.get( e ) );
			});
			return array;
		},
    toHTML: function( target ){
      //We are targeting html form using semantic css styles
      if( !$( target ).hasClass( "ui form" ) ){
        $( target ).addClass( "ui form" );
      }
      $( target ).empty();

      var field;
      var label;
      var input;
      var m = this;
      Object.keys( this.attributes ).forEach( function( key ){
        field = $( "<div/>", { "class": "field" } );
        label = $( "<label/>" ).text( m.toTitleCase( key ) );

        if( m.attributes_display.hasOwnProperty( key ) ){
        //if( isObject( sobj[key] ) ){
          var t = m.attributes_display[key];
          switch ( t.type ) {
            case "select":
              input = m.createDropDown( key, t.values );
              break;
            case "time":
              input = m.createCalendarInput( key, t.type );
              break;
						case "hidden":
							input = m.createHiddenInput( key );
							break;
            default:
              throw t.type + " is not suported yet";
          }

        }else{
          input = m.createTextInput( key );
        }
        field.append( label ).append( input );
        $( target ).append( field );
      });


    },
    createCalendarInput: function( key, c_or_t, opts ){
      var dv = $( "<div/>", { "class": "ui calendar", "id": key } );
      var idiv = $( "<div/>", { "class": "ui input left icon" } );
      idiv.append( $( "<i/>", { "class": c_or_t+" icon" } ) );
			var inpt = $( "<input/>", { "type": "text", "placeholder": this.toTitleCase( key ), "data-bind-entry": key } );
			if( this.get( key ) ){
				inpt.val( this.get( key ) );
			}
      idiv.append( inpt );
      return dv.append( idiv );
    },
    createTextInput: function( key ){
      return $( "<input/>", { "type":"text", "name": key, "id": key, "placeholder": this.toTitleCase( key ), "data-bind-entry": key } ).val( this.get( key ) );
    },
		createHiddenInput: function( key ){
			return $( "<input/>", { "type":"hidden", "name": key, "id": key, "data-bind-entry": key } ).val( this.get( key ) );
		},
    createDropDown: function( key, dropdown_values ){
      var dv = $( "<div/>", { "class": "ui selection dropdown", "id": key } );
      dv.append( $( "<div/>", { "class": "text" } ) );
			dv.append( $( "<input/>", { "type": "hidden", "class": "hidden", "data-bind-entry": key } ) );
      dv.append( $( "<i/>", { "class": "dropdown icon" } ) );
      return dv.dropdown({
        values: dropdown_values, onChange: function( v, t, $choice ){
					dv.find( ".hidden" ).val( v );
				}
      }).dropdown( 'set selected', this.get( key ) ).dropdown( 'refresh' );
      return dv;
    },
    addDropdownInput: function( attr_name, initialSelection, vals ){
			if( initialSelection ){
      	this.set( attr_name, initialSelection );
			}
      var selectobj = {
        type: "select",
        values: vals
      };
      this.attributes_display[ attr_name ] = selectobj;
    },
    addCalendarInput: function( attr_name, value, tp, opts ){
      this.set( attr_name, value );
      var selectobj = {
        type: tp,
				options: opts
      };
      this.attributes_display[ attr_name ] = selectobj;
    },
		addHiddenInput: function( attr_name, value ){
			this.set( attr_name, value );
			var selectobj = {
				type: "hidden"
			}
			this.attributes_display[ attr_name ] = selectobj;
		},
		_binder: binder
	};

	// Subscribe to the PubSub
	binder.on( uid + ":change", function( evt, attr_name, new_val, initiator ) {
		if ( initiator !== set ) {
			set.set( attr_name, new_val );
		}
	});
	return set;
}
