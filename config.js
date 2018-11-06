var db_server = process.env.DBSERVER || '192.168.17.193:27017';
var port = process.env.PORT || 8088;
var host_url = 'http://localhost:'+port;
var env = process.env.NODE_ENV || 'development';

module.exports = {
  'database_url' : 'mongodb://'+db_server+'/pickups_db',
  'database_url_test' : 'mongodb://'+db_server+'/test_pickups_db',
  'application_port' : port,
  'application_url' : host_url,
  'pickups_resource' : '/v1/pickups',
  'pickups_manager_resource' : '/v1/pickups_manager',
  'resources' : [ '/v1/pickups', '/v1/pickups_manager' ],
  'application_name' : 'IBCPickups',
  'environment': env
}
