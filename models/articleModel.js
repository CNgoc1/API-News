const { checktopicsExists, checkUserExists } = require("../checks");
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

function fetchArticles(
  sort_by = "created_at",
  order = "desc",
  topic,
  page = 1,
  limit = 10
) {
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

  if (!page || isNaN(page) || page < 1) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!limit || isNaN(limit) || limit < 1) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

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
    sql += `WHERE articles.topic = $${values.length + 1} `;
    values.push(topic);
  }

  sql += `ORDER BY ${sort_by} ${order.toUpperCase()}`;

  if (limit && page) {
    sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, (page - 1) * limit);
  }

  return db.query(sql, values).then((result) => {
    const formattedArticles = result.rows.map((article) => {
      const { body, ...rest } = article;
      return {
        ...rest,
        created_at: article.created_at.toLocaleDateString(),
      };
    });
    return formattedArticles;
  });
}

function fetchArticleComments(id, limit = 10, page = 1) {
  if (id < 1 || isNaN(id) || !id) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  if (limit < 1 || isNaN(limit) || !limit) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  if (page < 1 || isNaN(page) || !page) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  const queryValues = [id];

  let sql = `SELECT * FROM comments WHERE comments.article_id = $${queryValues.length} ORDER BY comments.created_at DESC`;

  if (limit && page) {
    sql += ` LIMIT $${queryValues.length + 1} OFFSET $${
      queryValues.length + 2
    }`;
    queryValues.push(limit, page);
  }

  return db.query(sql, queryValues).then((result) => {
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

function addArticle(article) {
  const {
    author,
    title,
    body,
    topic,
    article_img_url = "default img url",
  } = article;
  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return checktopicsExists(topic)
    .then(() => {
      return checkUserExists(author);
    })
    .then(() => {
      return db.query(
        `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [author, title, body, topic, article_img_url]
      );
    })
    .then((result) => {
      const newArticle = result.rows[0];
      return { ...newArticle, comment_count: 0 };
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
  addArticle,
};
