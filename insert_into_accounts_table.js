/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");
const bcrypt = require('bcrypt');

const dbCon = mysql.createConnection({
    host: "us-cdbr-east-03.cleardb.com",
    user: "b37fcec36530b3",               // replace with the database user provided to you
    password: "20aa747a",                  // replace with the database password provided to you
    database: "heroku_4f8ca48fac41ab4",           // replace with the database user provided to you
    port: 3306
});

console.log("Attempting database connection");
dbCon.connect(function (err) {
    if (err) {
        throw err;
    }

    console.log("Connected to database!");

    const saltRounds = 10;
    const myPlaintextPassword = 'admin%'; // replace with password chosen by you OR retain the same value
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

    const rowToBeInserted = {
        acc_name: 'admin$',            // replace with acc_name chosen by you OR retain the same value
        acc_login: 'admin$',           // replace with acc_login chosen by you OR retain the same value
        acc_password: passwordHash      
    };

    console.log("Attempting to insert record into tbl_accounts");
    dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table record inserted!");
    });

    dbCon.end();
});
