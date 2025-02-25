const express = require('express');
const { adminlogin } = require("../Controllers/Admincontrollers");
// const { upload } = require('../Controllers/upload');
const { upload } = require('../config/cloudinary'); 
const { uploadProduct, getuploadProducts, saveuploadProduct, deleteuploadProduct, availableProducts, recentProduct } = require('../Controllers/upload'); // Ensure correct controller function import
const router = express.Router();

router.post("/adminlogin", adminlogin)
// router.post("/upload",  upload.single('image'), upload)
router.post("/upload", upload.single('image'), uploadProduct);
router.get("/getuploadProducts", getuploadProducts)
router.put("/saveuploadProduct/:id", saveuploadProduct)
router.delete("/deleteuploadProduct/:id", deleteuploadProduct)
router.get("/availableProducts", availableProducts)
router.get("/recentProduct", recentProduct)

module.exports = router;