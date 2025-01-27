const fetchArticle = require("../models/articleModel");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}

module.exports = { getArticle };
