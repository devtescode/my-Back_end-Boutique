

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

module.exports.getuploadProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Assuming Mongoose model
        res.json({ products });
        // console.log(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


module.exports.saveuploadProduct = async (req, res) => {
    console.log(req.body);

    try {
        const { productName, description, price, image } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { productName, description, price, image },
            { new: true }
        );
        res.json({ success: true, message: "Product updated", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating product" });
    }
}

module.exports.deleteuploadProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

module.exports.availableProducts = async(req, res) => {
    try {
        const productCount = await Product.countDocuments(); // Count all products
        res.json({ count: productCount });
    } catch (error) {
        console.error("Error fetching product count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }   
}   


module.exports.recentProduct = async (req, res) => {
    try {
        const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(3); // Get the last 3 products
        res.json({ products: recentProducts });
    } catch (error) {
        console.error("Error fetching recent products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
 

module.exports.getProduct = async(req, res)=>{
    try {
       const productId = req.params.id;
       
       // Find the product by ID
       const product = await Product.findById(productId);
    
       if (!product) {
         return res.status(404).json({ success: false, message: "Product not found" });
       }
    
       res.status(200).json({ success: true, product });
       } catch (error) {
       console.error("Error fetching product:", error);
       res.status(500).json({ success: false, message: "Server error" });
    }
}
// router.get("/getProduct/:id", async (req, res) => {
//     try {
//       const productId = req.params.id;
      
//       // Find the product by ID
//       const product = await Product.findById(productId);
  
//       if (!product) {
//         return res.status(404).json({ success: false, message: "Product not found" });
//       }
  
//       res.status(200).json({ success: true, product });
//     } catch (error) {
//       console.error("Error fetching product:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   });
  