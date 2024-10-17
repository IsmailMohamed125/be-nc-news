const express = require("express");
const {
  pactchCommentById,
  deleteCommentById,
} = require("../controllers/comments.controller");

const router = express.Router();

router.route("/:comment_id").patch(pactchCommentById).delete(deleteCommentById);

module.exports = router;
