const { fetchArticle, fetchArticles } = require("../models/articleModel");

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
      console.log(articles, "here");
      res.status(200).send({ articles });
    })
    .catch(next);
}

module.exports = { getArticle, getArticles };
