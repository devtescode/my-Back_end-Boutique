const express = require('express');
const { userwelcome, register, login, db,  } = require("../Controllers/user.controllers")
const router = express.Router();

router.get("/user", userwelcome)
router.post("/register", register)
router.post("/login", login)
router.get("/db", db)

module.exports = router;