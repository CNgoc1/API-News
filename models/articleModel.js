const db = require("../db/connection");

function fetchArticle(id) {
  if (id < 1 || isNaN(id) || !id) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
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
      return formattedArticles;
    });
}

function fetchArticleComments(id) {
  if (id < 1 || isNaN(id) || !id) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`,
      [id]
    )
    .then((result) => {
      return result.rows;
    });
}

function addComment(comment, id) {
  const { username, body } = comment;
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, id]
    )
    .then((result) => {
      return result.rows[0];
    });
}

function updateArticle(newVotes, id) {
  const { inc_Vote } = newVotes;
  if (isNaN(inc_Vote) || !inc_Vote || inc_Vote === 0) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_Vote, id]
    )
    .then((result) => {
      return result.rows[0];
    });
}

module.exports = {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
  updateArticle,
};
