var mysql = require('mysql');

var dbconnect = {
getConnection: function() {
    var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "database",
    database: "sp_games"
});
return conn;
}
};

module.exports = dbconnect