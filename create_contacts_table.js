/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");

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

    const sql = `CREATE TABLE tbl_clicks (
        contact_id   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username         VARCHAR(30),
        experiment   VARCHAR(10),
        phase     VARCHAR(10),
        time     VARCHAR(100),
        point VARCHAR(10)
    )`;

    console.log("Attempting to create table: tbl_clicks");
    dbCon.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table tbl_accounts created");
    });

    dbCon.end();
});
