const express = require("express");
const {
  getAllUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:username").get(getUserByUsername);

module.exports = router;
