const router = require('express').Router()
const connection = require('../database.js')
var cors = require('cors')
router.use(cors())

// Upvote
router.post('/createUpvote/:post_id', (req, res) => {
  var user_id = req.body.user_id
  var post_id = req.params.post_id
  const createUpvoteQuery = `
    INSERT INTO post_votes(user_id, post_id, vote_value)
    VALUES ($1, $2, 1);
        `
  connection.query(
    createUpvoteQuery,
    [user_id, post_id],
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error while upvoting' })
      } else {
        console.log(results)
        if (results.rowCount === 1) {
          res.status(200).json({ message: 'Successfully upvoted' })
        } else {
          res.status(404).json({ error: `Unable to create upvote` })
        }
      }
    }
  )
})

// Downvote
router.post('/createDownvote/:post_id', (req, res) => {
  var user_id = req.body.user_id
  var post_id = req.params.post_id
  const createDownvoteQuery = `
    INSERT INTO post_votes(user_id, post_id, vote_value)
    VALUES ($1, $2, -1);
        `
  connection.query(
    createDownvoteQuery,
    [user_id, post_id],
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error while downvoting' })
      } else {
        console.log(results)
        if (results.rowCount === 1) {
          res.status(200).json({ message: 'Successfully downvoted' })
        } else {
          res.status(404).json({ error: `Unable to create downvote` })
        }
      }
    }
  )
})

// Delete Vote
router.delete('/deleteVote/:user_id/:post_id', function (req, res, next) {
  var user_id = req.params.user_id
  var post_id = req.params.post_id
  connection
    .query(`DELETE FROM post_votes WHERE user_id = $1 AND post_id = $2`, [user_id, post_id])
    .then(function (result) {
      res.status(200).json({ message: 'Successfully deleted vote' })
    })
    .catch(function (error) {
      console.log(error)
      return next(error)
    })
})

// Get Vote
router.get('/viewVotes/:post_id', function (req, res, next) {
  const postid = req.params.post_id
  const findVoteQuery = ` 
    SELECT * FROM post_votes 
    WHERE post_id = $1 
        `

  connection.query(findVoteQuery, [postid], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while finding votes',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `Votes not found`,
        })
      } else {
        res.status(200).json({
          vote: results.rows,
        })
      }
    }
  })
})

module.exports = router
