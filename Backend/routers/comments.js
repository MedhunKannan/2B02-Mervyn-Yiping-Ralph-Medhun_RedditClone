const router = require("express").Router();
const connection = require("../database.js");
var cors = require('cors');
router.use(cors());
module.exports = router;
