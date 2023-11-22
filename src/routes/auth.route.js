const express = require("express");
const router = express.Router();
const usersController = require("../controllers/auth.controller");

router.post("/login", usersController.login);
router.get("/", usersController.getAllUsers);

module.exports = router;
