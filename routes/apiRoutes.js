const express = require("express");
const { getAllEndpoints } = require("../controllers/api.controller");

const router = express.Router();

router.route("/").get(getAllEndpoints);

module.exports = router;
