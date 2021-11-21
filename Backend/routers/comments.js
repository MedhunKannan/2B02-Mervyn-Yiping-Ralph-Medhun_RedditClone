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
  var body = req.body.body
  var author_id = req.body.author_id
  var post_id = req.body.post_id
  const createCommentQuery = `
  INSERT INTO comments(body, author_id, post_id, created_at, updated_at)
  VALUES ($1, $2, $3, NOW() at time zone 'SGT', NOW() at time zone 'SGT');
      `
  connection.query(
    createCommentQuery,
    [body, author_id, post_id],
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error while commenting' })
      } else {
        console.log(results)
        if (results.rowCount === 1) {
          res.status(200).json({ message: 'Successfully commented' })
        } else {
          res.status(404).json({ error: `Unable to create comment` })
        }
      }
    }
  )
});

// Edit Comment
router.put('/editComment/:id', (req, res) => {
  var body = req.body.body
  var id = req.params.id
  const editCommentQuery = `
       UPDATE posts 
       SET body = $1, 
       updated_at = NOW() at time zone 'SGT' 
       WHERE id = $2;
      `

  connection.query(editCommentQuery, [body, id], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({ error: 'Error while editing post' })
    } else {
      console.log(results)
      if (results.rowCount === 1) {
        res.status(200).json({ message: 'Updated comment successfully' })
      } else {
        res.status(404).json({
          error: `Unable to edit comment. Make sure that all input fields are filled.`,
        })
      }
    }
  })
})

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