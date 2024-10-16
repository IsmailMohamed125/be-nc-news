const express = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentOnArticle,
  patchArticleById,
} = require("../controllers/articles.controller");

const router = express.Router();

router.route("/").get(getAllArticles);

router.route("/:article_id").get(getArticleById).patch(patchArticleById);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postCommentOnArticle);

module.exports = router;
