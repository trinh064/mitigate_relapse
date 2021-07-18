const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var mysql = require('mysql');
var fs = require('fs');
var parser = require('xml2json');

fs.readFile( './dbconfig.xml', function(err, data) {
  var json = JSON.parse(parser.toJson(data, {reversible: true}))['dbconfig'];
 
  console.log("Connecting to database ...");
  console.log(JSON.stringify(json));
  con=mysql.createConnection({
    host: json.host.$t,
    user: json.user.$t,               // replace with the database user provided to you
    password: json.password.$t,                  // replace with the database password provided to you
    database: json.database.$t,           // replace with the database user provided to you
    port: json.port.$t
});
});



// TODO: Add implementation for other necessary end-points
module.exports = router;

