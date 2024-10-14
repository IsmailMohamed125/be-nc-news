const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRoutes");

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
  next();
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error!" });
});
module.exports = app;
