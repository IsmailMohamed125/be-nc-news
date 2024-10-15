const {
  selectArticles,
  selectArticle,
  selectComments,
  insertComment,
} = require("../models/articles");
const { validationResult } = require("express-validator");

const getAllArticles = (req, res, next) => {
  selectArticles()
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
  const promises = [selectComments(article_id), selectArticle(article_id)];
  Promise.all(promises)
    .then((comments) => {
      res.status(200).send({ comments: comments[0] });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentOnArticle = (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length !== 0) {
    next({ status: 400, msg: errors[0].msg });
  }
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
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
};
