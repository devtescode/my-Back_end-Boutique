const { Userschema } = require("../Models/user.models")
const axios = require('axios')
const env = require('dotenv')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Product = require("../Models/product")

module.exports.useraddtocart = async (req, res) => {
    const { userId, productId, quantity, state, city, productName, image, description } = req.body;
    console.log("📥 Received Data:", { userId, productId, quantity, state, city, productName, image, description });

    if (!state || !city) {
        return res.status(400).json({ message: "State and city are required." });
    }

    try {
        let user = await Userschema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product has required fields
        if (!product.productName || !product.description || !product.image) {
            return res.status(500).json({ message: "Product details are incomplete in the database." });
        }

        // Check if item already exists in cart
        const existingItem = user.cart.find((item) => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.state = state;
            existingItem.city = city;
        } else {
            user.cart.push({
                productId,
                quantity,
                state,
                city,
                productName: product.productName,  // ✅ Use correct field name
                image: product.image,
                description: product.description,
            });
        }

        await user.save();
        res.status(200).json({ message: "Item added to cart", cart: user.cart });

    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        res.status(500).json({ message: "Error adding to cart", error });
    }
};
