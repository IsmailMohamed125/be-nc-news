const express = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
} = require("../controllers/articles.controller");

const router = express.Router();

router.route("/").get(getAllArticles);

router.route("/:article_id").get(getArticleById);

router.route("/:article_id/comments").get(getCommentsByArticle);

module.exports = router;
