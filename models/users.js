const db = require("../db/connection");

function selectUsers() {
  return db.query(`SELECT * FROM users`).then((data) => {
    return data.rows;
  });
}

module.exports = { selectUsers };
