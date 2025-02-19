const express = require('express');
const { adminlogin } = require("../Controllers/Admincontrollers")
const router = express.Router();

router.post("/adminlogin", adminlogin)


module.exports = router;