const router = require('express').Router()
const connection = require('../database.js')
var cors = require('cors')
router.use(cors())
router.post('/createpost', (req, res) => {
  var type = req.body.type
  var title = req.body.title
  var body = req.body.body
  var authorid = req.body.author_id
  var subredditid = req.body.subreddit_id
  const createPostQuery = `
  INSERT INTO posts(type, title, body, author_id, subreddit_id, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5, NOW() at time zone 'SGT', NOW() at time zone 'SGT');
      `
  connection.query(
    createPostQuery,
    [type, title, body, authorid, subredditid],
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error while posting' })
      } else {
        console.log(results)
        if (results.rowCount === 1) {
          res.status(200).json({ message: 'Successfully posted' })
        } else {
          res.status(404).json({ error: `Unable to create post` })
        }
      }
    }
  )
})

router.delete('/deletepost/:id', function (req, res, next) {
  const postid = req.params.id
  connection
    .query(`DELETE FROM posts WHERE id = $1`, [postid])
    .then(function (result) {
      res.status(200).json({ message: 'Successfully deleted' })
    })
    .catch(function (error) {
      console.log(error)
      return next(error)
    })
})

router.put('/editPost/:id', (req, res) => {
  var type = req.body.type
  var title = req.body.title
  var body = req.body.body
  var authorid = req.body.author_id
  var subredditid = req.body.subreddit_id
  var id = req.params.id
  const updatePostQuery = `
      UPDATE posts
      SET type = $1, 
      title = $2, 
      body = $3, 
      subreddit_id = $4,
      updated_at = NOW() at time zone 'SGT'
      WHERE id = $5;
      `

  connection.query(
    updatePostQuery,
    [type, title, body, subredditid, id],
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error while editing post' })
      } else {
        console.log(results)
        if (results.rowCount === 1) {
          res.status(200).json({ message: 'Edited post successfully' })
        } else {
          res.status(404).json({ error: `Unable to edit post` })
        }
      }
    }
  )
})

module.exports = router
