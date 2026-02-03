const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
  month_year: { type: String, required: true }, // e.g., "02-2026"
  history: [{
    price: Number,
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('PriceHistory', PriceHistorySchema);