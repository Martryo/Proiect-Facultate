const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');

exports.updateProduct = async (req, res) => {
    console.log("🔔 Incoming ID:", req.body.external_id);
    try {
        const { 
            master_product_id, 
            source_store, 
            external_id, 
            url, 
            title, 
            description, 
            images, 
            price 
        } = req.body;

        const monthYear = new Date().toLocaleString('en-GB', { month: '2-digit', year: 'numeric' }).replace('/', '-');

        // 1. Find and Update the Product (or create if it doesn't exist)
        const product = await Product.findOneAndUpdate(
            { source_store, external_id },
            { 
                master_product_id, 
                url, 
                title, 
                description, 
                images, 
                current_price: price, 
                last_updated: new Date() 
            },
            { upsert: true, new: true }
        );

        // 2. Add to Price History Bucket
        await PriceHistory.updateOne(
            { product_id: product._id, month_year: monthYear },
            { $push: { history: { price, timestamp: new Date() } } },
            { upsert: true }
        );

        res.status(200).json({ success: true, message: "Product and History updated", data: product });
    } catch (error) {
        console.error("❌ EROARE LA SALVARE:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // CHANGE: Use .find() to get ALL cards with this ID
        const products = await Product.find({ master_product_id: id });
        
        
        res.status(200).json({
            products: products // Send the array
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};