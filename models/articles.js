const db = require("../db/connection");
const format = require("pg-format");
const { prepareNewComment } = require("../db/seeds/utils");

function selectArticles() {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
          COUNT(*)::int AS comment_count
          FROM articles
          JOIN comments
          on articles.article_id = comments.article_id 
          GROUP BY articles.article_id
          ORDER BY articles.created_at DESC`
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

function selectComments(article_id) {
  return db
    .query(
      `SELECT comment_id, comments.author, comments.article_id, comments.created_at, comments.votes, comments.body 
        FROM comments
        JOIN articles
        on articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        ORDER BY comments.created_at DESC`,
      [article_id]
    )
    .then((data) => {
      return data.rows;
    });
}

function insertComment(newComment, article_id) {
  const formattedComment = prepareNewComment(newComment, article_id);
  const queryString = format(
    `INSERT INTO comments (author, body, article_id)
    VALUES %L RETURNING *;`,
    formattedComment
  );
  return db.query(queryString).then((data) => {
    return data.rows;
  });
}

function updateArticle(votes, article_id) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, article_id]
    )
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    });
}

module.exports = {
  selectArticles,
  selectArticle,
  selectComments,
  insertComment,
  updateArticle,
};
