const {
  selectArticles,
  selectArticle,
  selectComments,
  insertComment,
  updateArticle,
  insertArticle,
  deleteArticle,
} = require("../models/articles");
const { selectUser } = require("../models/users");

const getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;
  selectArticles(sort_by, order, topic, limit, p)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const promises = [
    selectArticle(article_id),
    selectComments(article_id, limit, p),
  ];
  Promise.all(promises)
    .then((comments) => {
      res.status(200).send({ comments: comments[1] });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  const promises = [
    selectArticle(article_id),
    insertComment(newComment, article_id),
    selectUser(newComment.username),
  ];

  Promise.all(promises)
    .then((comment) => {
      res.status(201).send({ comment: comment[1] });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [
    selectArticle(article_id),
    updateArticle(inc_votes, article_id),
  ];
  Promise.all(promises)
    .then((article) => {
      res.status(200).send({ article: article[1] });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (req, res, next) => {
  const newArticle = req.body;
  const promises = [selectUser(newArticle.author), insertArticle(newArticle)];

  Promise.all(promises)
    .then((article) => {
      res.status(201).send({ article: article[1] });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentOnArticle,
  patchArticleById,
  postArticle,
  deleteArticleById,
};
