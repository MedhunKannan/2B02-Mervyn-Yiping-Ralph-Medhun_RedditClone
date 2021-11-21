const pg = require("pg");

const connection = new pg.Pool({
  user: "uzlfkabz",
  password: "ikVcW8DJbfrK_FZKQWSEe4wvPv77Jbfl",
  host: "john.db.elephantsql.com",
  database: "uzlfkabz"
});

module.exports = connection;
