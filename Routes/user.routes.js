const express = require('express');
const { userwelcome, register, login, db, like,  } = require("../Controllers/user.controllers");
const { useraddtocart, usergetusercart } = require('../Controllers/user.addtocart');
const router = express.Router();

router.get("/user", userwelcome)
router.post("/register", register)
router.post("/login", login)
router.get("/db", db)
router.post("/like/:id", like)
router.post("/useraddtocart", useraddtocart)
router.get("/usergetusercart/:userId", usergetusercart)

module.exports = router;