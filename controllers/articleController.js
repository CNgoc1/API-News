const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
} = require("../models/articleModel");

const checkUserExists = require("../checkUserExists.js");
const checkArticleExists = require("../checkArticleExists");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}

function getArticles(req, res, next) {
  fetchArticles()
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

module.exports = {
  getArticle,
  getArticles,
  getArticleComment,
  postArticleComment,
};
