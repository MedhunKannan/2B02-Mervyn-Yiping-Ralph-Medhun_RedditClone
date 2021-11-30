const router = require('express').Router()
const connection = require('../database.js')
var cors = require('cors')
router.use(cors())

//Create Subreddit
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


//Search for specific Subreddit
router.get('/searchSubreddit/', function (req, res, next) {
  const subredditName = req.body.name
  const searchSubredditNameQuery = {
    text: 'SELECT * FROM subreddits WHERE name = $1;',
    values: [subredditName],
  }
  console.log(searchSubredditNameQuery)
  connection.query(searchSubredditNameQuery, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while looking for the subreddit',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `Subreddit ${subredditName} not found`,
        })
      } else {
        res.json({
            id: results.rows[0].id,
          name: results.rows[0].name,
          description: results.rows[0].description,
          created_at: results.rows[0].created_at,
        })
      }
    }
  })
})


//Update Subreddit description
router.put('/updateSubreddit/:subreddit_id', (req, res) => {
  var subredditDescription = req.body.description
  var subredditID = req.params.subreddit_id
  const updateSubredditQuery = `
        UPDATE subreddits
        SET description = $1
        WHERE id = $2;
        `

  connection.query(
    updateSubredditQuery,
    [subredditDescription, subredditID],
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
            .json({ error: `Subreddit ${subredditID} not found` })
        }
      }
    }
  )
})


//Delete Subreddit
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


//Retrieve all Subreddits
router.get('/subreddit', function (req, res, next) {
  // const course = req.params.course;
  const findsubredditQuery = {
    text: 'SELECT * FROM subreddits',
  }
  console.log(findsubredditQuery)
  connection.query(findsubredditQuery, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while retrieving subreddit',
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

//Search for specific Subreddit based on ID
router.get('/searchSubredditID/:subreddit_id', function (req, res, next) {
    const subredditID = req.params.subreddit_id
    const searchSubredditIDQuery = {
      text: 'SELECT * FROM subreddits WHERE id = $1;',
      values: [subredditID],
    }
    console.log(searchSubredditIDQuery)
    connection.query(searchSubredditIDQuery, (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({
          Error: 'Something went wrong while looking for the subreddit',
        })
      } else {
        if (results.rows.length === 0) {
          res.status(404).json({
            error: `Subreddit ID ${subredditID} not found`,
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


module.exports = router
