const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');

exports.updateProductPrice = async (data) => {
  const { external_id, source_store, price } = data;
  const monthYear = new Date().toLocaleString('en-GB', { month: '2-digit', year: 'numeric' }).replace('/', '-');

  // 1. Update or Create the Product
  const product = await Product.findOneAndUpdate(
    { external_id, source_store },
    { ...data, current_price: price, last_updated: new Date() },
    { upsert: true, new: true }
  );

  // 2. Add to History (Bucket Pattern)
  await PriceHistory.updateOne(
    { product_id: product._id, month_year: monthYear },
    { $push: { history: { price, timestamp: new Date() } } },
    { upsert: true }
  );

  return product;
};