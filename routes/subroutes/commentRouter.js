const commentRouter = require("express").Router();

const { deleteComment } = require("../../controllers/articleController");

commentRouter.delete("/:comment_id", deleteComment);

module.exports = commentRouter;
