const express = require('express');
const { userwelcome, register, login, testingApi,  } = require("../Controllers/user.controllers")
const router = express.Router();

router.get("/user", userwelcome)
router.post("/register", register)
router.post("/login", login)

module.exports = router;