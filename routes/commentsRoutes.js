const express = require("express");
const { deleteCommentById } = require("../controllers/comments.controller");

const router = express.Router();

router.route("/:comment_id").delete(deleteCommentById);

module.exports = router;
