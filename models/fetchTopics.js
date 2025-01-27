const { response } = require("../app");
const db = require("../db/connection");

function fetchTopics() {
  return db.query("SELECT * FROM topics").then((results) => {
    return results.rows;
  });
}

module.exports = fetchTopics;
