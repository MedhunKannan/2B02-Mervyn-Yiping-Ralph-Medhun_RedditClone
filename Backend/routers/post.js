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
  var title = req.body.title
  var body = req.body.body
  var id = req.params.id
  const editPostQuery = `
       UPDATE posts 
       SET title = $1, 
       body = $2, 
       updated_at = NOW() at time zone 'SGT' 
       WHERE id = $3;
      `

  connection.query(editPostQuery, [title, body, id], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({ error: 'Error while editing post' })
    } else {
      console.log(results)
      if (results.rowCount === 1) {
        res.status(200).json({ message: 'Updated post successfully' })
      } else {
        res.status(404).json({
          error: `Unable to edit post. Make sure that all input fields are filled.`,
        })
      }
    }
  })
})

router.get('/post', function (req, res, next) {
  const getpost = {
    text: 'SELECT * FROM posts',
  }
  connection.query(getpost, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while retrieving post',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `unable to retrieve post`,
        })
      } else {
        res.json({
          post: results.rows,
        })
      }
    }
  })
})

router.get('/post/:id', function (req, res, next) {
  var id = req.params.id
  const getpost = {
    text: 'SELECT * FROM posts WHERE id = $1',
  }
  connection.query(getpost, [id], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while retrieving post',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `unable to find post`,
        })
      } else {
        res.json({
          post: results.rows,
        })
      }
    }
  })
})

module.exports = router
