const db = require("../db/connection");

function fetchArticle(id) {
  if (id < 1 || isNaN(id) || !id) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      console.log(result.rows);
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }
      return { article: result.rows[0] };
    });
}

function fetchArticles() {
  return db
    .query(`SELECT * FROM articles ORDER BY articles.created_at DESC`)
    .then((result) => {
      const formattedArticles = result.rows.map((article) => {
        const { body, ...rest } = article;
        return {
          ...rest,
          created_at: new Date(article.created_at).getTime(),
        };
      });
      console.log(formattedArticles);
      return formattedArticles;
    });
}

module.exports = { fetchArticle, fetchArticles };
