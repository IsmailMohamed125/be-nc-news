const db = require("../db/connection");

function selectArticles() {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
          COUNT(*)::int AS comment_count
          FROM articles
          JOIN comments
          on articles.article_id = comments.article_id 
          GROUP BY articles.article_id`
    )
    .then((data) => {
      return data.rows;
    });
}

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

module.exports = { selectArticles, selectArticle };
