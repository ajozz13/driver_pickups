'use strict';
var Winston = require( 'winston' );
var fs = require( 'fs' );
var config = require( '../config' );
var env = config.environment;
var logDir = 'logs';
var tsFormat = () => logtimestamp();//(new Date()).toLocaleTimeString();

if( !fs.existsSync( logDir ) ){
	fs.mkdirSync( logDir );
}

var logger = Winston.createLogger({
	transports: [
		//colorize
		new Winston.transports.Console({
			colorize: true,
			level: 'info'
		}),
		new Winston.transports.File({
			filename: `${logDir}/${config.application_name}.log`,
			timestamp: tsFormat,
			level: env = 'development' ? 'debug' : 'info'
		})
	]
});

function logtimestamp(){
	return new Date().toISOString();
}

module.exports = logger;
