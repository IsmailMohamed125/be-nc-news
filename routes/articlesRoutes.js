const express = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentOnArticle,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controller");

const router = express.Router();

router.route("/").get(getAllArticles).post(postArticle);

router
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postCommentOnArticle);

module.exports = router;
