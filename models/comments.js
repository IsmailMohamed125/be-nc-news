const db = require("../db/connection");

// Not an endpoint model that can be used just using as a check as I didn't want to have a lot of queries in one model and helps make code DRY // Dont know if belongs here or utils
function selectComment(comment_id) {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      return rows;
    });
}

function deleteComment(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      return rows;
    });
}

function updateComment(votes, comment_id) {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [votes, comment_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { selectComment, updateComment, deleteComment };
