const router = require("express").Router();
const commentsRouter = require("./comments");
const subredditRouter = require("./subreddits");
const likesRouter = require("./post_votes");
const postVotesRouter = require("./posts");
const usersRouter = require("./comments");

router.use("/comments", commentsRouter);
router.use("/communities", subredditRouter);
router.use("/postvotes", likesRouter);
router.use("/posts", postVotesRouter);
router.use("/users", usersRouter);
module.exports = router;
