const express = require('express')
const cors = require('cors')

const router = require('express').Router()
const commentsRouter = require('./comments')
const subredditRouter = require('./subreddits')
const likesRouter = require('./post_votes')
const postVotesRouter = require('./post')
const usersRouter = require('./users')

// const port = process.env.PORT

// const app = express()

// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
router.use('/comments', commentsRouter)
router.use('/subreddits', subredditRouter)
router.use('/post_votes', likesRouter)
router.use('/post', postVotesRouter)
router.use('/users', usersRouter)

module.exports = router

// app.listen(port, () => {
//     console.log(`App is listening on port ${port}`)
//   })
