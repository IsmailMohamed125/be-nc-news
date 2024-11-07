const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routes/apiRoutes");
const {
  routeErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./controllers/error.controller");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeErrorHandler);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);
module.exports = app;
