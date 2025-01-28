const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
} = require("../models/articleModel");

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

module.exports = { getArticle, getArticles, getArticleComment };
