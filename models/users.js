const db = require("../db/connection");

function selectUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function selectUser(username) {
  if (!username) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
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

module.exports = { selectUsers, selectUser };
