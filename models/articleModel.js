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

module.exports = fetchArticle;
