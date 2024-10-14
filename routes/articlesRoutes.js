const express = require("express");
const { getArticleById } = require("../controllers/articles.controller");

const router = express.Router();

router.route("/:article_id").get(getArticleById);

module.exports = router;
