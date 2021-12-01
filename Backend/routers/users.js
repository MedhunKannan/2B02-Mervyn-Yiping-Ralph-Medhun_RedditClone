const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const config = require('../config/config')
// const validInfo = require('../middleware/validInfo')
const createJWT = require('../utils/createJWT')
const connection = require('../database.js')
var cors = require('cors')
const router = express.Router()
router.use(cors())

// const addToken = async (userid) => {
//   const token = await jwt.sign({ id: userid }, config.secret)

//   const updateUserTokensStatement = `
//     update users
//     set tokens = tokens || $1
//     where id = $2
//     returning *
//   `
//   const {
//     rows: [user],
//   } = await query(updateUserTokensStatement, [[token], userid])
//   return { user, token }
// }

router.post('/register', async (req, res) => {
  console.log('Register')
  try {
    const { username, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const bcryptPassword = await bcrypt.hash(password, salt)

    const newUser = await connection.query(
      `INSERT INTO users(
        username, 
        password, created_at, updated_at)
        VALUES($1, $2, NOW() at time zone 'SGT', NOW() at time zone 'SGT') RETURNING *;`,
      [username, bcryptPassword]
    )

    //res.json(newUser.rows)
    const token = createJWT(newUser.rows[0].id)
    res.json({ token })
  } catch (err) {
    console.log(err.message)
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await connection.query(
    'SELECT * FROM users where username = $1 ',
    [username]
  )

  if (user.rows.length === 0) {
    return res.status(401).json('Invalid Credential')
  }

  const validPassword = await bcrypt.compare(
    password,
    user.rows[0].password,
    console.log('Logged In')
  )

  if (!validPassword) {
    return res.status(401).json('Invalid Credential')
  }
  console.log('user_id: ' + JSON.stringify(user.rows[0]))
  const jwtToken = createJWT(user.rows[0].id)
  return res.json({ jwtToken })
})

//Update user, user's account name (update)
router.put('/users/:id', async (req, res) => {
  try {
    var id = req.params.id
    const username = req.body.username
    const user2 = await connection.query(
      `UPDATE users
        SET username = $1,
        updated_at = NOW() at time zone 'SGT'
        WHERE id = $2`,
      [username, id]
    )
    //console.log("Updated successfully?")
    res.json(user2.rows)
  } catch (err) {
    console.log(err.message)
  }
})

//Update user, user's password (update)
router.put('/password/:id', async (req, res) => {
  try {
    var id = req.params.id
    const password = req.body.password
    const newPassword = await connection.query(
      `UPDATE users
        SET password = $1,
        updated_at = NOW() at time zone 'SGT'
        WHERE id = $2`,
      [password, id]
    )
    //console.log("Updated successfully?")
    res.json(newPassword.rows)
  } catch (err) {
    console.log(err.message)
  }
  //if pw field is empty, prompt user
  // if (pw.length === 0) {
  //     console.log('Please enter a new password');
  // }
})

//delete account
router.delete('/deleteusers/:id', async (req, res) => {
  try {
    var id = req.params.id
    const deleteAcc = await connection.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    )
    res.send(deleteAcc.rows)
    res.status(200).json({ message: 'Successfully deleted' })
  } catch (err) {
    console.log(err.message)
  }
})

// get user from userid
router.get('/getusername/:id', function (req, res, next) {
  const userid = req.params.id
  const getUsernameQuery = {
    text: 'SELECT username FROM users WHERE id = $1',
  }
  connection.query(getUsernameQuery, [userid], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while finding username',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `username not found`,
        })
      } else {
        res.status(200).json({
          comment: results.rows,
        })
      }
    }
  })
})

router.get('/getusername', function (req, res, next) {
  const userid = req.params.id
  const getUsernameQuery = {
    text: 'SELECT username FROM users',
  }
  connection.query(getUsernameQuery, (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).json({
        Error: 'Something went wrong while finding username',
      })
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({
          error: `username not found`,
        })
      } else {
        res.status(200).json({
          comment: results.rows,
        })
      }
    }
  })
})

module.exports = router
