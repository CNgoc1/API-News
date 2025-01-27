const express = require("express");
const endPointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topicsController");
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endPointsJson });
});

app.get("/api/topics", getTopics);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.code) {
    res.status(err.code).send(err.msg);
  }
});

module.exports = app;
