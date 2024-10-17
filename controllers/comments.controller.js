const {
  selectComment,
  updateComment,
  deleteComment,
} = require("../models/comments");

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const pactchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [
    selectComment(comment_id),
    updateComment(inc_votes, comment_id),
  ];
  Promise.all(promises)
    .then((comment) => {
      res.status(200).send({ comment: comment[1] });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { pactchCommentById, deleteCommentById };
