const router = require("express").Router();
const connection = require("../database.js");
var cors = require("cors");
router.use(cors());

router.get("/viewcomment/:post_id", function (req, res, next) {
  const postid = req.params.post_id;
  // const course = req.params.course;
  const findCommentQuery = {
    text: "SELECT * FROM comments WHERE post_id = $1",
  };
  console.log(postid);
  connection.query(findCommentQuery, [postid], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        Error: "Something went wrong while finding comment",
      });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `Comment not found`,
        });
      } else {
        res.status(200).json({
          comment: results.rows,
        });
      }
    }
  });
});

module.exports = router;
