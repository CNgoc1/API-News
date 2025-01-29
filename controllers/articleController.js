const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,

  removeComment,

  updateArticle,
} = require("../models/articleModel");

const {
  checkUserExists,
  checkArticleExists,
  checkCommentExists,
} = require("../checks.js");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleComment(req, res, next) {
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then(() => {
      return fetchArticleComments(article_id);
    })
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch(next);
}

function postArticleComment(req, res, next) {
  const { body } = req;
  const { article_id } = req.params;
  const { username } = body;

  checkArticleExists(article_id)
    .then(() => {
      return checkUserExists(username);
    })
    .then(() => {
      return addComment(body, article_id);
    })
    .then((comment) => {
      res.status(201).send({ body: comment });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return removeComment(comment_id);
    })
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
}

function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const newVotes = req.body;

  checkArticleExists(article_id)
    .then(() => {
      return updateArticle(newVotes, article_id);
    })
    .then((newArticle) => {
      res.status(200).send({ body: newArticle });
    })
    .catch(next);
}

module.exports = {
  getArticle,
  getArticles,
  getArticleComment,
  postArticleComment,

  deleteComment,

  patchArticle,
};
