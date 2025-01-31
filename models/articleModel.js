const db = require("../db/connection");

function fetchArticle(id) {
  if (id < 1 || isNaN(id) || !id) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }

  return db
    .query(
      `
    SELECT articles.*, 
    COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }
      const results = result.rows[0];
      const formattedResults = {
        ...results,
        comment_count: Number(results.comment_count) || 0,
      };
      return { article: formattedResults };
    });
}

function fetchArticles(sort_by = "created_at", order = "desc", topic) {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrder = ["desc", "asc"];

  const validTopics = ["mitch", "cats", "paper"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
  let sql = `SELECT * FROM articles `;
  const values = [];

  if (topic) {
    sql += `WHERE articles.topic = $1 `;
    values.push(topic);
  }

  sql += `ORDER BY ${sort_by} ${order.toUpperCase()}`;

  return db.query(sql, values).then((result) => {
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
function removeComment(id) {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*`, [
    id,
  ]);
}

module.exports = {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  addComment,
  updateArticle,
};
