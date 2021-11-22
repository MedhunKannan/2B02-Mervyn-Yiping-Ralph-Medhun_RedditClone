/*
Wonna Tun
DIT/FT/1B/02
*/

const { profile, error } = require("console");
const { isUndefined } = require("util");
const db = require("./databaseConfig");

const game = {

    search: function(title, platform, price, callback) {
        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                var sql1;
                var sql2;
                var sql3;
                if (!title || title == "All") {
                    sql1 = "Select * from game g, category c where g.fk_categoryid = c.categoryid"
                } else {
                    sql1 = `select * from game g, category c where g.title like "%${title}%" and g.fk_categoryid = c.categoryid`;
                }

                if (!platform || platform == "Select") {
                    sql2 = "Select * from game g, category c where g.fk_categoryid = c.categoryid"
                } else {
                    sql2 = `select * from game g, category c where g.platform like "%${platform}%" and c.categoryid = g.fk_categoryid`;
                }

                if(!price || price == 0) {
                    sql3 = `Select * from game g, category c where g.fk_categoryid = c.categoryid`;                
                } else {
                    sql3 = `select * from game g, category c where g.price <= ${price} and g.fk_categoryid = c.categoryid`;
                }

                const sqlStatement = "select * from (" + sql1 + ") a, (" + sql2 + ") b, ("+ sql3 +") c where a.gameid = b.gameid and a.gameid = c.gameid";

                conn.query(sqlStatement,  (error, results) => {
                    conn.end();
                    if (error) {
                        callback(error, null);
                        console.log(error)
                        console.log(sqlStatement)

                    } else if (results.length === 0) {
                        callback(null, results);
                        console.log(title, platform)
                    } else {
                        callback(null, results);
                        console.log(sqlStatement)
                    }
                });
            }
        });
    },

    // Endpoint 06 
    addGame: function(newGame, callback) {

        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                var { title, description, price, platform, fk_categoryid, year } = newGame;
                const validationSql =
                    `SELECT gameid, title, description, price, platform, fk_categoryid, year FROM 
                game WHERE title = ?`;
                conn.query(validationSql, [title, fk_categoryid], function(err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else if (result.length !== 0) {
                        console.log("Clash with existing game...");
                        var gameid = result[0].gameid;
                        // to edit here (to check if the category is already existed)
                        const validationGameCat =
                            `Select * from game_category where gameid = ? and catid = ?`;
                        conn.query(validationGameCat, [result[0].gameid, fk_categoryid], function(err, result) {
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            } else if (result.length !== 0) {
                                console.log("Exist")
                                return callback(null, "cat_exist")
                            } else {
                                const insertSql = 'Insert into game_category(gameid, catid) values(?,?)';
                                conn.query(insertSql, [gameid, fk_categoryid], function(err, result) {
                                    // conn.end();
                                    if (err) {
                                        console.log(err);
                                        return callback(err, null);
                                    } else {
                                        callback(null, gameid);
                                    }
                                });
                            }
                        })

                    } else {
                        const insertSql = 'Insert into game(title, description, price, platform, fk_categoryid, year) values(?,?,?,?,?,?)';
                        conn.query(insertSql, [title, description, price, platform, fk_categoryid, year], function(err, result) {
                            // conn.end();
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            } else {
                                const insertSql = 'Insert into game_category(gameid, catid) values(?,?)';
                                conn.query(insertSql, [result.insertId, fk_categoryid], function(err, result) {
                                    // conn.end();
                                    if (err) {
                                        console.log(err);
                                        return callback(err, null);
                                    } else {
                                        console.log("inserted into game_category")
                                            // callback(null, result.insertId);
                                    }
                                });
                                callback(null, result.insertId);
                            }
                        });
                    }
                });

            }
        });
    },

    // Endpoint 07
    getGamesByPlatform: function(platform, callback) {
        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const findUserByIDQuery =
                    `SELECT g.gameid, g.title, g.description, g.price, g.platform, s.catid, c.catname,
                 g.year, g.created_at, g.pic FROM game g, category c, game_category s WHERE 
                 g.platform = ? AND c.categoryid = s.catid and g.gameid = s.gameid`;
                conn.query(findUserByIDQuery, [platform], (error, results) => {
                    conn.end();
                    if (error) {
                        callback(error, null);
                    } else if (results.length === 0) {
                        callback(null, "Cannot find record!");
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },

    // Endpoint 08
    deleteGame: function(gameid, callback) {
        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const selectGame = "Select gameid, title from game where gameid = ?";
                conn.query(selectGame, [gameid], (error, results) => {

                    if (error) {
                        callback(error, null);
                    } else if ((results[0]) === undefined) {
                        console.log("I am here")
                        var status = "invalid"
                        callback(null, status)
                    } else {
                        console.log("I am in defined")
                        const deleteUserQuery = "DELETE FROM game WHERE gameid = ?;";
                        conn.query(deleteUserQuery, [gameid], (error, results) => {
                            conn.end();
                            if (error) {
                                callback(error, null);
                            } else {
                                callback(null, results);
                            }
                        });

                    }
                })

            }
        });
    },

    // Endpoint 09
    editGame: function(gameid, newGame, callback) {
        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const editGameQuery = `select * from game where gameid = ?`;
                conn.query(editGameQuery, [gameid], (error, results) => {
                    var { title, description, price, platform, fk_categoryid, year, pic } = newGame;
                    if (error) {
                        callback(error, null);
                    } else if (results[0] === undefined) {
                        var status = "invalid"
                        callback(null, status)
                    } else if (title == results[0].title) {
                        var status = "existed";
                        return callback(null, status)
                    } else {
                        if (!title) title = results[0].title;
                        if (!description) description = results[0].description;
                        if (!price) price = results[0].price;
                        if (!platform) platform = results[0].platform;
                        if (!fk_categoryid) fk_categoryid = results[0].fk_categoryid;
                        if (!year) year = results[0].year;
                        if (!pic) pic = results[0].pic;
                        const editCategoryQuery =
                            `
                            UPDATE game
                            SET
                            title = ?,
                            description = ?,
                            price = ?,
                            platform = ?,
                            fk_categoryid = ?,
                            year = ?,
                            pic = ?
                            WHERE gameid = ?
                            `;
                        conn.query(editCategoryQuery, [title, description, price, platform, fk_categoryid, year, pic, gameid], (error, results) => {
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

    getGames: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const findAllGames = "SELECT * FROM game;";
                dbConn.query(findAllGames, (error, results) => {
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

    getGamesByTitle: function(title, callback) {
        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const findUserByIDQuery =
                    `SELECT * from game where title = ?`;
                conn.query(findUserByIDQuery, [title], (error, results) => {
                    conn.end();
                    if (error) {
                        callback(error, null);
                    } else if (results.length === 0) {
                        callback(null, findUserByIDQuery);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },

    getGamesById: function(gameid, callback) {
        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) { //database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const findUserByIDQuery =
                    `SELECT g.gameid, g.title, g.description, g.price, g.platform, s.catid, c.catname,
                    g.year, g.created_at, g.pic FROM game g, category c, game_category s WHERE 
                    g.gameid = ? AND c.categoryid = s.catid and g.gameid = s.gameid`;
                conn.query(findUserByIDQuery, [gameid], (error, results) => {
                    conn.end();
                    if (error) {
                        callback(error, null);
                    } else if (results.length === 0) {
                        callback(null, findUserByIDQuery);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },


};

module.exports = game;