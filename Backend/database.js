const pg = require("pg");

const connection = new pg.Pool({
  user: "iqsqfzop",
  password: "4OzHIZbzfBsr6s9DyPD0NQfnmdQpjBjV",
  host: "john.db.elephantsql.com",
  database: "iqsqfzop",
});

module.exports = connection;
