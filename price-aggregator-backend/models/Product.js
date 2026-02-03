const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  master_product_id: { type: String, required: true, index: true }, // e.g., "zotac-4090"
  source_store: { type: String, required: true }, // e.g., "eMAG"
  external_id: { type: String, required: true }, // ID from the store's site
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  images: [String],
  current_price: { type: Number, required: true },
  currency: { type: String, default: 'RON' },
  last_updated: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate listings from the same store
ProductSchema.index({ source_store: 1, external_id: 1 }, { unique: true });

module.exports = mongoose.model('Product', ProductSchema);