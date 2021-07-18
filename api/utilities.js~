const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var mysql = require('mysql');
 
 const excel = require('exceljs');
 
 

var fs = require('fs');
var parser = require('xml2json');

fs.readFile( './dbconfig.xml', function(err, data) {
  var json = JSON.parse(parser.toJson(data, {reversible: true}))['dbconfig'];
  console.log(JSON.stringify(json));
  con=mysql.createConnection({
    host: json.host.$t,
    user: json.user.$t,               // replace with the database user provided to you
    password: json.password.$t,                  // replace with the database password provided to you
    database: json.database.$t,           // replace with the database user provided to you
    port: json.port.$t
});
});


router.get('/contactsinfo', function (req, res) {
    // TODO: Implement code to fetch contacts from the database
	console.log("inside API");
  con.query("SELECT * FROM tbl_contacts", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });

});

//Handle login request after hitting submit
router.post('/submit', function (req, res) {
console.log("Inside submit");
console.log("Body",req.body);
var uname=req.body.Username;
var pass=req.body.Password;
const saltRounds = 10;
if(uname==''){res.status(200).send('false');}
else{
con.query("SELECT * FROM tbl_accounts WHERE acc_login = ?",uname, function (err, result, fields) {
if (err) throw err;
if(result.length==0){res.status(200).send('false')}
else{
var hashpass=result[0].acc_password;
bcrypt.compare(pass,hashpass,function(err,result){
	if (result) {loginstate=1;loginuser=uname;}
res.status(200).send(result);
    });}
  });}
});

//add contact to tbl_contacts
router.post('/postContactEntry', function (req, res) {
console.log("Body",req.body);
iname= req.body.name;       
category=req.body.category;     
ilocation= req.body.location;
contact_info=req.body.contact;
email=req.body.email;
website=req.body.website;
website_url= req.body.website_url;
const rowToBeInserted = {
        name: iname       ,  
        category:  category ,       
        location: ilocation,
        contact_info:contact_info,
        email:email,
        website:website,
        website_url: website_url    
    };
con.query('SELECT * FROM tbl_contacts WHERE name=?', [iname], function (err, result) {
        if (err) {throw err;}   
        console.log(result);
         if (result.length >0 ){res.status(200).send("name existed"); }
         else{console.log("Attempting to insert record into tbl_contacts");
        con.query('INSERT tbl_contacts SET ?', rowToBeInserted, function (err, result) {
        if (err) {throw err;}   
         console.log(result);  
});
res.redirect(303,"/contacts");}

});

    
});

//update a contact
router.post('/updateentry', function (req, res) {
console.log("Body",req.body);
iname= req.body.name;       
category=req.body.category;     
ilocation= req.body.location;
contact=req.body.contact;
email=req.body.email;
website=req.body.website;
website_url= req.body.website_url;
 
    console.log("Attempting to edit record in tbl_contacts");
    con.query('UPDATE tbl_contacts SET category=?, location=?, contact_info=?, email=?, website=?, website_url=?  WHERE name = ?;',[category,ilocation,contact,email,website,website_url,iname], function (err, result) {
        if (err) {throw err;}   
         console.log(result);  
});
res.redirect(303,"/contacts");
});

//delete a contact
router.post('/delete', function (req, res) {
console.log("Body",req.body.name);
ctname= req.body.name ;       
    con.query('DELETE FROM tbl_contacts WHERE name=?', [ctname], function (err, result) {
        if (err) {throw err;}   
         console.log(result);  
});
res.redirect(303,"/contacts");
});
router.get('/getuser', function(req, res) {
	res.status(200).send(loginuser);
    // TODO: Add Implementation
});
//handle logout request
router.get('/logout', function(req, res) {
	loginstate=0;
	res.redirect(307,"/login");
	req.session.destroy();
    // TODO: Add Implementation
});

router.get('/export',function (req,res) {
 	// -> Query data from MySQL
	con.query("SELECT * FROM tbl_contacts", function (err, contacts, fields) {
		
		const jsonContacts = JSON.parse(JSON.stringify(contacts));
		console.log(fields);
		
		let workbook = new excel.Workbook(); //creating workbook
		let worksheet = workbook.addWorksheet('Contacts'); //creating worksheet
	 
		//  WorkSheet Header
		worksheet.columns = [
			{ header: 'contact_id', key: 'contact_id', width: 10 },
			{ header: 'name', key: 'name', width: 30 },
			{ header: 'category', key: 'category', width: 30},
			{ header: 'location', key: 'location', width: 10},
			{ header: 'contact_info', key: 'contact_info', width: 10},
			{ header: 'email', key: 'email', width: 10},
			{ header: 'website', key: 'website', width: 80}
		];
		// Add Array Rows
		worksheet.addRows(jsonContacts);
	
		// Write to File
		workbook.csv.writeFile("contacts.csv").then(function() {
			console.log("file saved!");
			res.download("contacts.csv");	
		});
		
			
	});

});
// TODO: Add implementation for other necessary end-points
module.exports = router;

