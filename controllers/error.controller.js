exports.routeErrorHandler = (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
  next();
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "2201W" ||
    err.code === "2201X"
  ) {
    res.status(400).send({ msg: "Bad request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  }
  next(err);
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error!" });
};
