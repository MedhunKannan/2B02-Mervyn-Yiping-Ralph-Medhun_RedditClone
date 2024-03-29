const express = require("express");
// const serveStatic=require('serve-static');

var hostname = "localhost";
var port = 3001;

var app = express();
var cors = require("cors");
const router = express.Router();
router.use("*", cors());

app.use(function (req, res, next) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query.id);

  if (req.method != "GET") {
    res.type(".html");
    var msg =
      "<html><body>This server only serves web pages with GET!</body></html>";
    res.end(msg);
  } else {
    next();
  }
});

// app.use(serveStatic(__dirname+"/public"));
app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 3001);
