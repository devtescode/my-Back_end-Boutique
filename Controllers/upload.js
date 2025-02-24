

// const storage = multer.memoryStorage(); // Store in memory before uploading
// const upload = multer({ storage })
const Product = require('../Models/product'); 


module.exports.uploadProduct = async (req, res) => {
    try {        
        const { productName, price, description } = req.body;
        const imageUrl = req.file?.path; // Cloudinary stores image in `path`        
        if (!imageUrl) {
            console.log("Image upload failed!")
            
            return res.status(400).json({ message: "Image upload failed!" });
        }

        // Save to database
        const newProduct = new Product({
            productName,
            price,
            description,
            image: imageUrl,
        })
        console.log("Save successfully", newProduct);
    
        await newProduct.save();
        res.status(201).json({ message: "Product uploaded successfully!", newProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports.getuploadProducts = async(req, res)=>{
    try {
        const products = await Product.find(); // Assuming Mongoose model
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}