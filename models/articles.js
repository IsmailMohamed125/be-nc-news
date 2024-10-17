const db = require("../db/connection");
const format = require("pg-format");

function selectArticles(
  sort_by = "created_at",
  order = "DESC",
  topic,
  limit = 10,
  p
) {
  const validColumns = [
    "title",
    "article_id",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }
  const validOrders = ["ASC", "DESC"];
  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order direction" });
  }

  let queryString = `SELECT articles.author, title, articles.article_id, 
        topic, articles.created_at, articles.votes, article_img_url, 
        COUNT(*)::int AS comment_count, CAST(COUNT(*) OVER() AS INTEGER) AS total_count
        FROM articles
        JOIN comments
        on articles.article_id = comments.article_id`;
  const direction = order.toUpperCase();
  const queryVals = [sort_by, direction];

  if (topic) {
    queryString += ` WHERE topic = %L`;
    queryVals.unshift(topic);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY %I %s`;
  queryString += ` LIMIT %L`;
  queryVals.push(limit);

  return db
    .query(format(queryString, ...queryVals))
    .then((data) => {
      if (data.rows.length === 0 && topic) {
        return db.query(`SELECT slug FROM topics WHERE slug = $1`, [topic]);
      }
      if (p) {
        if (!Number(p)) {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
        const total = data.rows[0].total_count;
        const page = p;
        const skip = (page - 1) * limit;
        if (skip > total) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        queryVals.push(skip);
        queryString += ` OFFSET %L;`;
        return db.query(format(queryString, ...queryVals));
      }
      return data;
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      if (rows[0].slug) return [];
      return rows;
    });
}

function selectArticle(article_id) {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, articles.body,
        topic, articles.created_at, articles.votes, article_img_url,
        COUNT(*)::int AS comment_count
        FROM articles
        JOIN comments
        on articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`,
      [article_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return db.query(`SELECT * FROM articles WHERE article_id = $1`, [
          article_id,
        ]);
      }
      return data;
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found`,
        });
      }
      if (!rows[0].comment_count) rows[0].comment_count = 0;
      return rows;
    });
}

function selectComments(article_id, limit = 10, p) {
  let queryString = `SELECT comment_id, comments.author, comments.article_id, 
  comments.created_at, comments.votes, comments.body,
  CAST(COUNT(*) OVER() AS INTEGER) AS total_count
  FROM comments
  JOIN articles
  on articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  ORDER BY comments.created_at DESC
  LIMIT $2`;
  const queryVals = [article_id, limit];
  return db
    .query(queryString, queryVals)
    .then((data) => {
      if (p) {
        if (!Number(p)) {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
        const total = data.rows[0].total_count;
        const page = p;
        const skip = (page - 1) * limit;
        if (skip > total) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        queryVals.push(skip);
        queryString += ` OFFSET $3;`;
        return db.query(queryString, queryVals);
      }
      return data;
    })
    .then(({ rows }) => {
      return rows;
    });
}

function insertComment(newComment, article_id) {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id)
       VALUES ($1, $2, $3) RETURNING *;`,
      [newComment.username, newComment.body, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function updateArticle(votes, article_id) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function insertArticle({ author, title, topic, body, article_img_url }) {
  let queryString = `INSERT INTO articles (author, title, topic, body)
  VALUES ($1, $2, $3, $4) RETURNING *`;
  let queryVals = [author, title, topic, body];
  if (article_img_url) {
    queryString = `INSERT INTO articles (author, title, topic, body, article_img_url)
  VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    queryVals.push(article_img_url);
  }

  return db.query(queryString, queryVals).then(({ rows }) => {
    return rows;
  });
}

function deleteArticle(article_id) {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      article_id,
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

module.exports = {
  selectArticles,
  selectArticle,
  selectComments,
  insertComment,
  updateArticle,
  insertArticle,
  deleteArticle,
};
