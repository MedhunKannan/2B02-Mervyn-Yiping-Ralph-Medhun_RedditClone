/*
Wonna Tun
DIT/FT/1B/02
*/

const db = require("./databaseConfig");

const reviews = {

    // Endpoint 10
    addReview: function (userid, gameid,newReview, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                var { content, rating } = newReview;
                const insertSql = 'Insert into reviews(content, rating,fk_gameid, fk_userid) values(?,?, ?, ?)';
                conn.query(insertSql, [content, rating,gameid, userid], function (err, result) {
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
    },

    // Endpoint 11
    getReviewByGameid: function (gameid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {//database connection gt issue!
                console.log(err);
                callback(err, null);
            } else {
                const findReviewByGameid =
                    `SELECT g.gameid, r.content, r.rating, u.username, r.created_at FROM reviews r, user u, game g WHERE 
                 r.fk_gameid = ? AND r.fk_userid = u.userid and g.gameid = r.fk_gameid order by r.created_at desc`;
                conn.query(findReviewByGameid, [gameid], (error, results) => {
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



};

module.exports = reviews;
