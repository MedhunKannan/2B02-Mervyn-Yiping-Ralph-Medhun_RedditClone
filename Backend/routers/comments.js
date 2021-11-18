const router = require("express").Router();
const connection = require("../database.js");
var cors = require("cors");
router.use(cors());

// View Comments
router.get("/viewComment/:post_id", function (req, res, next) {
  const postid = req.params.post_id;
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

// Create Comment
router.post('/createComment', (req, res) => {

  var comment = req.body.comment;
  const createCommentQuery = `
    INSERT INTO comments(comment)
    VALUES ($1);
        `;

  connection.query(createCommentQuery, [comment], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Error while creating comment' });
    } else {
      console.log(results);
      if (results.rowCount === 1) {
        res.status(200).json({ message: 'Successfully created comment' });
      } else {
        res.status(404).json({ error: `Unable to create comment ${comment}` });
      }
    }
  });
});

// Delete Comment
router.delete("/deleteComment/:commentid", function (req, res, next) {
  const commentid = req.params.commentid;
  connection
    .query(`DELETE FROM comments WHERE commentid = $1`, [commentid])
    .then(function (result) {
      res.status(200).json({ message: "Successfully deleted comment" });
    })
    .catch(function (error) {
      console.log(error);
      return next(error);
    });
});

module.exports = router;