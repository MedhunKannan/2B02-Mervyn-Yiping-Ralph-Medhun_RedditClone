const router = require('express').Router()
const connection = require('../database.js')
var cors = require('cors')
router.use(cors())

//Create Community
router.post('/createSubreddit', (req, res) => {
  var subredditName = req.body.name
  var subredditDescription = req.body.description
  const createSubredditQuery = `
    INSERT INTO subreddits(name, description)
    VALUES ($1, $2);
        `

  connection.query(
    createSubredditQuery,
    [subredditName, subredditDescription],
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error while creating subreddit' })
      } else {
        console.log(results)
        if (results.rowCount === 1) {
          res.status(200).json({ message: 'Successfully created subreddit' })
        } else {
          res
            .status(404)
            .json({ error: `Unable to create subreddit ${subredditName}` })
        }
      }
    }
  )
})

router.get('/searchSubreddit/:name', function (req, res, next) {
  const subredditName = req.params.name
  const findBookQuery = {
    text: 'SELECT * FROM subreddits WHERE name = $1;',
    values: [subredditName],
  }
  console.log(findBookQuery)
  connection.query(findBookQuery, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while looking for the subreddit',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `Subreddit ${subreddit} not found`,
        })
      } else {
        res.json({
          name: results.rows[0].name,
          description: results.rows[0].description,
          created_at: results.rows[0].created_at,
        })
      }
    }
  })
})

router.put('/updateSubreddit', (req, res) => {
  var subredditDescription = req.body.description
  var subredditName = req.body.name
  const updateSubredditQuery = `
        UPDATE subreddits
        SET description = $1
        WHERE name = $2;
        `

  connection.query(
    updateSubredditQuery,
    [subredditDescription, subredditName],
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error while updating description!' })
      } else {
        console.log(results)
        if (results.rowCount === 1) {
          res.status(200).json({ message: 'Updated successfully' })
        } else {
          res
            .status(404)
            .json({ error: `Subreddit ${subredditName} not found` })
        }
      }
    }
  )
})

router.delete('/deleteSubreddit', function (req, res, next) {
  var subredditName = req.body.name
  connection
    .query(`DELETE FROM subreddits WHERE name = $1`, [subredditName])
    .then(function (result) {
      return res.status(200).json({ message: 'Deleted successfully' })
    })
    .catch(function (error) {
      res.status(404).json({ error: `Subreddit ${subredditName} not found` })
    })
})

router.get('/sortSubredditByDateAsc', function (req, res, next) {
    const sortSubredditByDateAsc = `
    SELECT * FROM subreddits ORDER BY id 
    `
  console.log(sortSubredditByDateAsc)
  connection.query(sortSubredditByDateAsc, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while retrieving subreddits',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `unable to retrieve subreddits`,
        })
      } else {
        res.json({
          subreddit: results.rows,
        })
      }
    }
  })
})

module.exports = router
