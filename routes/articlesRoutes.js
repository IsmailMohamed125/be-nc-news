const express = require("express");
const {
  getAllArticles,
  getArticleById,
} = require("../controllers/articles.controller");

const router = express.Router();

router.route("/").get(getAllArticles);

router.route("/:article_id").get(getArticleById);

module.exports = router;
