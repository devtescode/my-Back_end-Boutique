const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Store Cloudinary image URL
        required: true,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
