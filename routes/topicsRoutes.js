const express = require("express");
const { getAllTopics } = require("../controllers/topics.controller");

const router = express.Router();

router.route("/").get(getAllTopics);

module.exports = router;
