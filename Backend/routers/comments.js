const router = require("express").Router();
const connection = require("../database.js");
var cors = require('cors');
router.use(cors());

router.get('/viewcomment', function (req, res, next) {
  const postid = req.body.postid;
  // const course = req.params.course;
  const findusernameQuery = {
      text: 'SELECT comment FROM comments WHERE postid = $1',
  };
  console.log(findusernameQuery)
  connection.query(findusernameQuery, (error, results) => {
      if (error) {
          console.log(error);
          res
              .status(500)
              .json({
                  Error: 'Something went wrong while finding comment'
              });
      } else {
          if (results.rows.length === 0) {
              res.status(404).json({
                  error: `Comment ${commentid} not found`
              });
          } else {
              res.json({
                  comment: results.rows
              });
          }
      }
  });
});


module.exports = router;
