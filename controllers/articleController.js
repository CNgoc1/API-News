const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
  addArticle,

  updateArticle,
} = require("../models/articleModel");

const { checkUserExists, checkArticleExists } = require("../checks.js");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const { sort_by, order, topic, page, limit } = req.query;

  fetchArticles(sort_by, order, topic, page, limit)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleComment(req, res, next) {
  const { article_id } = req.params;
  const { limit, page } = req.query;
  checkArticleExists(article_id)
    .then(() => {
      return fetchArticleComments(article_id, limit, page);
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

  return checkArticleExists(article_id)
    .then(() => {
      return checkUserExists(username);
    })
    .then(() => {
      return addComment(body, article_id);
    })
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
}

function postArticle(req, res, next) {
  const { body } = req;
  addArticle(body)
    .then((newArticle) => {
      res.status(201).send({ article: newArticle });
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
  getArticleById,
  getArticles,
  getArticleComment,
  postArticleComment,
  patchArticle,
  postArticle,
};
