const db = require("../db/connection");

function removeComment(id) {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*`, [
    id,
  ]);
}

function updateComment(newVotes, id) {
  const { inc_Votes } = newVotes;
  if (isNaN(inc_Votes) || !inc_Votes || inc_Votes === 0) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_Votes, id]
    )
    .then((result) => {
      return result.rows[0];
    });
}

module.exports = { removeComment, updateComment };
