const express = require("express");
const endPointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topicsController");
const {
  getArticle,
  getArticles,
  getArticleComment,
  postArticleComment,
} = require("./controllers/articleController");
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endPointsJson });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/article/:article_id/comments", getArticleComment);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
