const express = require("express");
const endPointsJson = require("./endpoints.json");
const apiRouter = require("./routes/api-router");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endPointsJson });
});

app.use("/api/router", apiRouter);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
