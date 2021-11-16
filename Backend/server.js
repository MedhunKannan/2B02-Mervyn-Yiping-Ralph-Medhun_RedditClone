const express = require("express");
const path = require("path");
const ApiRouter = require("./routers/api");

// The web server
const app = express();
var port = 8000;
var hostname = "localhost";

// To handle body
app.use(express.json());

// Web Server
app.use(express.static(path.join(__dirname, "public")));

// APIs
app.use("/api", ApiRouter);

// TODO: 404 Handler

// TODO: Error Handler

// Listen to port
app.listen(port, hostname, function () {
  console.log(`BackEnd Server hosted at http://${hostname}:${port}`);
});
