/*
Wonna Tun
DIT/FT/1B/02
*/

const db = require("./databaseConfig");
var config=require('../config.js'); 
var jwt=require('jsonwebtoken');

const category = {

    //get cat
    getCat: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const findAllCat = "SELECT * FROM category;";
                dbConn.query(findAllCat, (error, results) => {
                    dbConn.end();
                    if (error) {
                        callback(error, null);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 04
    addCategory: function (newCategory,  callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                var { catname, cat_description } = newCategory;
                const validationSql = 'SELECT catname, cat_description FROM category WHERE catname = ? OR cat_description = ?;';
                conn.query(validationSql, [catname, cat_description], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else if (result.length !== 0) {
                        console.log("Clash with existing catname...");
                        var status = "taken";
                        return callback(null, status);
                    } else {
                        const insertSql = 'Insert into category(catname, cat_description) values(?,?)';
                        conn.query(insertSql, [catname, cat_description], function (err, result) {
                            conn.end();
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            } else {
                                callback(null, result.insertId);
                            }
                        });
                    }
                });

            }
        });
    },

    // Endpoint 05
    editCategory: function (categoryId, newCategory, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {//database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const editCategoryQuery = `select * from category where categoryid = ?`;
                conn.query(editCategoryQuery, [categoryId], (error, results) => {
                    var {catname, description} = newCategory;
                    if (error) {
                        callback(error, null);
                    }else if(catname == results[0].catname) {
                        var status = "existed";
                        return callback(null, status)
                    }else {
                        if (!catname) {
                            catname = results[0].catname;
                        }
                        if (!description) {
                            description = results[0].description;
                        } 
                        
                        const editCategoryQuery =
                            `
                            UPDATE category
                            SET
                            catname = ?,
                            description = ?
                            WHERE categoryid = ?
                            `;
                        conn.query(editCategoryQuery, [catname, description, categoryId], (error, results) => {
                            conn.end();
                            if (error) {
                                callback(error, null);
                            } else {
                                callback(null, results.affectedRows);
                            }
                        });
                    }
                })
            }
        });
    },

   

};

module.exports = category;
