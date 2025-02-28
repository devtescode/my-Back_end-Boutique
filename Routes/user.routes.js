const express = require('express');
const { userwelcome, register, login, db, like,  } = require("../Controllers/user.controllers")
const router = express.Router();

router.get("/user", userwelcome)
router.post("/register", register)
router.post("/login", login)
router.get("/db", db)
router.post("/like/:id", like)

module.exports = router;