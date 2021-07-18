const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var mysql = require('mysql');

 const excel = require('exceljs');



var fs = require('fs');



router.get('/proData', function (req, res) {
  var spawn = require("child_process").spawn;
  con.query("SELECT * FROM tbl_clicks", function (err, result) {
    if (err) throw err;
    var process = spawn('python3',["./proData.py", JSON.stringify(result) ]);
    process.stdout.on('data', function(data) {
        res.status(200).send(data); });
      });
    });

router.post('/getScore', function (req, res) {

  var spawn = require("child_process").spawn;
    con.query("SELECT * FROM tbl_clicks", function (err, result) {
  if (err) throw err;
    var process = spawn('python3',["./getScore.py", JSON.stringify(result) ]);
  process.stdout.on('data', function(data) {
  res.status(200).send(data); });
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



router.post('/submitData', function (req, res) {
responselist= req.body.responselist;

  con.query('INSERT INTO tbl_clicks (uname,treatment,experiment,phase,session,time,shape,reinforcement) VALUES '+ responselist, function (err, result) {
  if (err) {throw err;}
   console.log(result);
  });

});



router.post('/delUser', function (req, res) {
thename= req.body.uname ;
console.log(thename);
    con.query('DELETE FROM tbl_clicks WHERE uname=?', [thename], function (err, result) {
        if (err) {throw err;}
         console.log(result);
});
res.redirect(303,"/");
});

//delete a contact
router.post('/delAll', function (req, res) {
    con.query('DELETE FROM tbl_clicks', function (err, result) {
        if (err) {throw err;}
         console.log(result);
});
res.redirect(303,"/");
});

router.get('/getMode', function(req, res) {
  console.log(mode);
	res.status(200).send(mode.toString()+experimentnumber.toString());
});

router.get('/getRate1', function(req, res) {
  con.query(`SELECT SUM(CASE WHEN treatment = 1 AND experiment =1 THEN reinforcement ELSE 0 END) AS rrate FROM tbl_clicks;
`, function (err, result) {
      if (err) {throw err;}
       console.log(result);
       rrate1=540/result[0].rrate;
       res.status(200).send(rrate1.toString());
     });

});

router.get('/getRate3', function(req, res) {
  con.query(`SELECT SUM(CASE WHEN treatment = 1 AND experiment =3 THEN reinforcement ELSE 0 END) AS rrate FROM tbl_clicks;
`, function (err, result) {
      if (err) {throw err;}
       console.log(result);
       rrate1=540/result[0].rrate;
       res.status(200).send(rrate1.toString());
     });

});

router.post('/checkname', function(req, res) {
  thename=req.body.uname;
  console.log(thename);
  con.query('SELECT * FROM tbl_clicks WHERE uname=?', [thename], function (err, result) {
  if (err) {throw err;}
  console.log(result);
  if (result.length >0 ){res.status(200).send("0"); }
  else {res.status(200).send("1");}
});
});


router.post('/setMode', function(req, res) {
  newmode=req.body.mode;
  mode=parseInt(newmode);
  console.log(mode);
	res.status(200).send(mode.toString());
});
router.post('/setExp', function(req, res) {
  experimentnumber=parseInt(req.body.experimentnumber);
	res.status(200).send(mode.toString()+experimentnumber.toString());
});
//handle logout request
router.get('/logout', function(req, res) {
	loginstate=0;
	res.redirect(307,"/login");
	req.session.destroy();
    // TODO: Add Implementation
});

router.get('/exportraw',function (req,res) {
 	// -> Query data from MySQL
	con.query("SELECT * FROM tbl_clicks", function (err, clicks) {

		const jsonClicks = JSON.parse(JSON.stringify(clicks));

		let workbook = new excel.Workbook(); //creating workbook
		let worksheet = workbook.addWorksheet('Contacts'); //creating worksheet

    columns=[];
    con.query("select column_name from information_schema.columns where table_name='tbl_clicks'", function (err, result) {
      if (err) throw err;

      for (let i =0 ; i<result.length;i++){
        columns.push({header:result[i].column_name,key:result[i].column_name, width: 40});
      }
      //  WorkSheet Header
      worksheet.columns =columns ;
      // Add Array Rows
      worksheet.addRows(jsonClicks);

      // Write to File
      workbook.csv.writeFile("rawdata.csv").then(function() {
        console.log("file saved!");
        res.download("rawdata.csv");
      });
    });
	});
});
// TODO: Add implementation for other necessary end-points
module.exports = router;
