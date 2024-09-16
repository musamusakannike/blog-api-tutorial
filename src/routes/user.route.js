const express = require("express");
const {
  registerNewUser,
  loginUser,
} = require("../controllers/user.controller");

const router = express.Router();

// REGISTER NEW USER
router.post("/register", registerNewUser);

// LOGIN AN EXISTENT USER
router.post("/login", loginUser);

module.exports = router;
