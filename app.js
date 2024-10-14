const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRoutes");
const topicsRouter = require("./routes/topicsRoutes");
const articlesRouter = require("./routes/articlesRoutes");

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error!" });
});
module.exports = app;
