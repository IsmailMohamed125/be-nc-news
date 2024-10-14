const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRoutes");
const topicsRouter = require("./routes/topicsRoutes");

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
  next();
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error!" });
});
module.exports = app;
