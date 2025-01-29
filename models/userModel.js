const db = require("../db/connection");

function fetchUsers() {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
}

module.exports = { fetchUsers };
