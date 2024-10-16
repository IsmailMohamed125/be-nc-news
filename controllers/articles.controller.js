const {
  selectArticles,
  selectArticle,
  selectComments,
  insertComment,
  updateArticle,
} = require("../models/articles");
const { validationResult } = require("express-validator");

const getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  selectArticles(sort_by)
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
  const promises = [selectArticle(article_id), selectComments(article_id)];
  Promise.all(promises)
    .then((comments) => {
      res.status(200).send({ comments: comments[1] });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentOnArticle = (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length !== 0) {
    next({ status: 400, msg: errors[0].msg });
    return;
  }
  const { article_id } = req.params;
  const newComment = req.body;
  const promises = [
    selectArticle(article_id),
    insertComment(newComment, article_id),
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

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentOnArticle,
  patchArticleById,
};
