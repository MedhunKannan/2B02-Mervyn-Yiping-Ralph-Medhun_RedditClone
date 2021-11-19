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

// const getPublicUser = (user) => {
//   delete user.password;
//   delete user.tokens;
//   return user;
// };

const addToken = async (userid) => {
  const token = await jwt.sign({ id: userid }, config.secret)

  const updateUserTokensStatement = `
    update users
    set tokens = tokens || $1
    where id = $2
    returning *
  `
  const {
    rows: [user],
  } = await query(updateUserTokensStatement, [[token], userid])
  return { user, token }
}

// router.get("/", async (req, res) => {
//   try {
//     const { rows } = await query("select * from users");
//     res.send(rows.map((user) => getPublicUser(user)));
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const selectUserStatement = `select * from users where id = $1`;

//     const {
//       rows: [user],
//     } = await query(selectUserStatement, [id]);

//     if (!user) {
//       return res
//         .status(404)
//         .send({ error: "Could not find user with that id" });
//     }
//     res.send(getPublicUser(user));
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

//

router.post('/register', async (req, res) => {
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
  const jwtToken = createJWT(user.rows[0].user_id)
  return res.json({ jwtToken })
})

//Update user, user's account name (update)
router.put('/users/:id', async (req, res) => {
  try {
    var id = req.params.id
    const username = req.body.username
    const user2 = await connection.query(
      `UPDATE users
        SET username = $1
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
        SET password = $1
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

// router.post("/logout", auth.verifyToken, async (req, res) => {
//   const tokens = req.user.tokens.filter((token) => token !== req.token);
//   const setUserTokensStatement = `
//     update users
//     set tokens = $1
//     where id = $2
//   `;
//   const {
//     rows: [user],
//   } = await query(setUserTokensStatement, [tokens, req.user.id]);
//   delete req.user;
//   delete req.token; //Self directed -- Vulnerabilites all that
//   res.send(user);
// });

// router.post("/logoutAll", auth.verifyToken, async (req, res) => {
//   const clearUserTokensStatement = `
//     update users
//     set tokens = '{}'
//     where id = $1
//   `;
//   const {
//     rows: [user],
//   } = await query(clearUserTokensStatement, [req.user.id]);
//   delete req.user;
//   delete req.token;
//   res.send(user);
// });

// router.put("/", auth.verifyToken, async (req, res) => {
//   try {
//     const allowedUpdates = ["username", "password"];
//     if (req.body.username !== undefined) {
//       const { rows } = await query(`select * from users where username = $1`, [
//         req.body.username,
//       ]);
//       if (rows.length > 0) {
//         return res.status(409).send({ error: "Username is already taken" });
//       }
//     }
//     if (req.body.password !== undefined) {
//       req.body.password = await bcrypt.hash(req.body.password, 10);
//     }
//     const user = await updateTableRow(
//       "users",
//       req.user.id,
//       allowedUpdates,
//       req.body
//     );

//     res.send(getPublicUser(user));
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// });

// router.delete("/", auth.verifyToken, async (req, res) => {
//   try {
//     const deleteUserStatement = `delete from users where id = $1 returning *`;

//     const {
//       rows: [user],
//     } = await query(deleteUserStatement, [req.user.id]);

//     if (!user) {
//       return res
//         .status(404)
//         .send({ error: "Could not find user with that id" });
//     }
//     res.send(getPublicUser(user));
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// });
module.exports = router
