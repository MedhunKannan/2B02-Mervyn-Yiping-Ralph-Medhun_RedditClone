const router = require("express").Router();
const connection = require("../database.js");
var cors = require('cors');
router.use(cors());

// Upvoting
router.put('/upVote/:postid', (req, res) => {

    const postid = req.params.post_id;
    const vote = req.body.vote;
    const upVoteQuery = `
    UPDATE post_votes 
    SET vote_value = vote_value + 1
    WHERE post_id = $1
          `;

    connection.query(upVoteQuery, [vote, postid], (error, results) => {
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

// Downvoting
router.put('/downVote/:postid', (req, res) => {

    const postid = req.params.post_id;
    const vote = req.body.vote;
    const downVoteQuery = `
    UPDATE post_votes 
    SET vote_value = vote_value - 1
    WHERE post_id = $1
          `;

    connection.query(downVoteQuery, [vote, postid], (error, results) => {
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