const router = require("express").Router();
const commentsRouter = require("./comments");
const communitiesRouter = require("./communities");
const likableRouter = require("./likable");
const likesRouter = require("./likes");
const postsRouter = require("./posts");
const usersRouter = require("./comments");

router.use("/comments", commentsRouter);
router.use("/communities", communitiesRouter);
router.use("/likable", likableRouter);
router.use("/likes", likesRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);
module.exports = router;
