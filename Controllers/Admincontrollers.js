const { Userschema } = require("../Models/user.models")
const axios = require('axios')
const env = require('dotenv')
const jwt = require('jsonwebtoken')
const ADMINSECRET = process.env.ADMINSECRET
const ADMINLOGIN = process.env.ADMINLOGIN
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { login } = require("./user.controllers")
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
