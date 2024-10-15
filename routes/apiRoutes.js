const express = require("express");
const topicsRouter = require("./topicsRoutes");
const articlesRouter = require("./articlesRoutes");
const commentsRouter = require("./commentsRoutes");
const { getAllEndpoints } = require("../controllers/api.controller");

const router = express.Router();
router.use("/topics", topicsRouter);
router.use("/articles", articlesRouter);
router.use("/comments", commentsRouter);

router.route("/").get(getAllEndpoints);

module.exports = router;
