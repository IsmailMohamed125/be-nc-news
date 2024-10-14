const db = require("../db/connection");

function selectArticle(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article with id ${article_id} not found`,
        });
      }
      return data.rows;
    });
}

module.exports = { selectArticle };
