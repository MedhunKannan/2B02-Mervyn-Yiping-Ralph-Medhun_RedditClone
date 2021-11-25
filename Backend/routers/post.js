const router = require('express').Router()
const connection = require('../database.js')
var cors = require('cors')
router.use(cors())

const uploadfile = require('./imageupload')
const multer = require('multer')
const upload = multer()

var fileupload = require('express-fileupload')
router.use(
  fileupload({
    useTempFiles: true,
  })
)

const cloudinary = require('cloudinary').v2
const config = require('../config/config')
const { application } = require('express')

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  upload_preset: 'upload',
})

router.post('/upload', function (req, res, next) {
  const file = req.files.photo
  console.log(file)
})

router.post('/createpost', async (req, res) => {
  var type = req.body.type
  var title = req.body.title
  var body = req.body.body
  var author_id = req.body.author_id
  var subreddit_id = req.body.subreddit_id
  let file = req.files.photo
  console.log('Hello1')
  console.log(req.body)
  console.log(file)
  try {
    uploadfile.uploadFile(file, async function (error, result) {
      if (error) {
        console.log('error')
        // console.log(error)
        res.status(500).json({ message: 'Error with file submission' })
      } else {
        let cloudinary_url = result.imageURL
        try {
          await uploadfile.insertImage(
            type,
            title,
            body,
            author_id,
            subreddit_id,
            cloudinary_url,
            (returnresults, issue) => {
              if (issue) {
                console.log(issue)
                res.status(400).json({ message: 'Error with file upload' })
              } else {
                res.status(201).send(returnresults)
              }
            }
          )
        } catch (err) {
          console.log(err)
          res.status(500).json({ message: 'Error with file submission' })
        }
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error!' })
  }
}) // End of create post

router.get('/viewPost/:id', function (req, res, next) {
  const postid2 = req.params.id
  const findPost = {
    text: 'SELECT * FROM posts WHERE id = $1',
  }
  console.log(postid2)
  connection.query(findPost, [postid2], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while finding post',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `Post does not exist`,
        })
      } else {
        res.status(200).json({
          comment: results.rows,
        })
      }
    }
  })
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
    text:  'SELECT posts.*, users.username FROM posts INNER JOIN users ON posts.author_id = users.id ',
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
