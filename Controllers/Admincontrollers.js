const { Userschema } = require("../Models/user.models")
const axios = require('axios')
const env = require('dotenv')
const jwt = require('jsonwebtoken')
const ADMINSECRET = process.env.ADMINSECRET
const ADMINLOGIN = process.env.ADMINLOGIN
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { login } = require("./user.controllers")
const Product = require("../Models/product")
env.config()


module.exports.adminlogin = async (req, res) => {
    console.log(ADMINLOGIN)
    try {
        const { Email, Password } = req.body;

        // Check if the email is the designated admin email
        if (Email !== ADMINLOGIN) {
            return res.status(403).json({ status: false, message: "Unauthorized: Admins only" });
        }

        // Find the user in the database
        const admin = await Userschema.findOne({ Email });
        if (!admin) {
            return res.status(400).json({ status: false, message: "Admin not found" });
        }
        // console.log(admin);
        

        // Verify password
        const isMatch = await bcrypt.compare(Password, admin.Password);
        if (!isMatch) {
            return res.status(400).json({ status: false, message: "Incorrect password" });
        }
        // console.log(Password, admin.Password);
        


       
        const adminToken = jwt.sign(
            { id: admin._id, Email: admin.Email, role: "admin" },
            ADMINSECRET, 
            { expiresIn: "1h" }
        );

        res.status(200).json({
            status: true,
            message: "Admin login successful",
            adminToken,
            adminData: {
                id: admin._id,
                Email: admin.Email,
                role: "admin",
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


module.exports.totalLikes = async(req,res)=>{
    try {
        const products = await Product.find();
        const totalLikes = products.reduce((sum, product) => sum + product.likes.length, 0);

        res.status(200).json({ totalLikes });
    } catch (error) {
        console.error("Error fetching total likes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.likedUsersWithProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("likes", "Username Email");

        let likedUsers = [];

        products.forEach(product => {
            product.likes.forEach(user => {
                if (!user || !user._id) return; // Prevent errors if user is undefined

                const existingUser = likedUsers.find(u => u.userId === user._id.toString());

                if (existingUser) {
                    existingUser.likedProducts.push({
                        productId: product._id,
                        productName: product.productName,
                        productImage: product.image // ✅ Include product image
                    });
                } else {
                    likedUsers.push({
                        userId: user._id.toString(),
                        Username: user.Username || "Unknown User",
                        Email: user.Email || "No Email",
                        likedProducts: [{
                            productId: product._id,
                            productName: product.productName,
                            productImage: product.image // ✅ Include product image
                        }]
                    });
                }
            });
        });

        res.status(200).json({ likedUsers });
    } catch (error) {
        console.error("Error fetching liked users with products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
