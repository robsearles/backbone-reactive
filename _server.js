// ************************************************************************
// # Static File Server
//
// This is a very simple static file server. This has been included to
// make it easier to test the Backbone-Reactive demo. You don't have
// to mess about with Apache, Nginx or any other web server.
// 
// ## Usage Once you have installed the requirements (listed below)
// you can run the server using the command:
//     
//      node /path.to/backbone-reactive/_server.js
//  
// You should now be able to visit http://localhost:7777 in your
// browser and see the demo.
// 
// ## Requirements
// nodejs: http://nodejs.org/
// connect module: http://www.senchalabs.org/connect/
//     - npm install connect
// 
// ************************************************************************

// required modules
var util = require('util');
var connect = require('connect');

// settings
var port = 7777;

// create the server and instruct it to server static files
connect.createServer(connect.static(__dirname)).listen(port);

// output some info for the user
console.log('Static server started on ' + port);
console.log('To stop the server, press Ctrl + C');