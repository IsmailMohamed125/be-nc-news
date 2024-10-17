const { selectTopics, insertTopic } = require("../models/topics");

const getAllTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const postTopic = (req, res, next) => {
  const newTopic = req.body;
  insertTopic(newTopic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllTopics, postTopic };
