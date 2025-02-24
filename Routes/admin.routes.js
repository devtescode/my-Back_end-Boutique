const express = require('express');
const { adminlogin } = require("../Controllers/Admincontrollers");
// const { upload } = require('../Controllers/upload');
const { upload } = require('../config/cloudinary'); 
const { uploadProduct } = require('../Controllers/upload'); // Ensure correct controller function import
const router = express.Router();

router.post("/adminlogin", adminlogin)
// router.post("/upload",  upload.single('image'), upload)
router.post("/upload", upload.single('image'), uploadProduct);

module.exports = router;