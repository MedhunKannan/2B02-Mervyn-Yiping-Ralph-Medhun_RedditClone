const router = require("express").Router();
const connection = require("../database.js");
var cors = require('cors');
router.use(cors());

// Send Vote
router.post('/createVote', (req, res) => {

    var vote = req.body.vote;
    const createVoteQuery = `
      INSERT INTO post_votes(vote)
      VALUES ($1);
          `;

    connection.query(createVoteQuery, [vote], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Error while voting' });
        } else {
            console.log(results);
            if (results.rowCount === 1) {
                res.status(200).json({ message: 'Successfully voted' });
            } else {
                res.status(404).json({ error: `Unable to vote ${vote}` });
            }
        }
    });
});

// Get Vote
router.get("/viewVotes/:post_id", function (req, res, next) {
    const postid = req.params.post_id;
    const findVoteQuery = ` 
    SELECT * FROM post_votes 
    WHERE post_id = $1 
        `;

    connection.query(findVoteQuery, [postid], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({
                Error: "Something went wrong while finding votes",
            });
        } else {
            if (results.rows.length === 0) {
                res.status(404).json({
                    error: `Votes not found`,
                });
            } else {
                res.status(200).json({
                    vote: results.rows,
                });
            }
        }
    });
});

module.exports = router;