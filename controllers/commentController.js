const { checkCommentExists } = require("../checks");
const { removeComment, updateComment } = require("../models/commentModel");

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return removeComment(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

function patchComment(req, res, next) {
  const { comment_id } = req.params;
  const newVotes = req.body;

  checkCommentExists(comment_id)
    .then(() => {
      return updateComment(newVotes, comment_id);
    })
    .then((newComment) => {
      res.status(200).send({ comment: newComment });
    })
    .catch(next);
}

module.exports = { deleteComment, patchComment };
