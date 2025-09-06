// Script: backfillProductImages.js
// Purpose: Adds category-based placeholder image URLs to products missing images.
// Usage: node server/utils/backfillProductImages.js

require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const categoryImageMap = {
  Clothing: 'https://images.unsplash.com/photo-1520974735194-95021d2ae239?auto=format&fit=crop&w=800&q=60',
  Electronics: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60',
  Furniture: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=60',
  Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=60',
  Sports: 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=800&q=60',
  Other: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=60'
};

async function run() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const products = await Product.find({ $or: [ { images: { $exists: false } }, { images: { $size: 0 } } ] });
    console.log(`Found ${products.length} products without images.`);

    let updated = 0;
    for (const p of products) {
      const url = categoryImageMap[p.category] || categoryImageMap.Other;
      p.images = [ { url, alt: p.title } ];
      await p.save();
      updated++;
      if (updated % 25 === 0) console.log(`Updated ${updated} products...`);
    }

    console.log(`Backfill complete. Updated ${updated} products.`);
  } catch (err) {
    console.error('Backfill error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected.');
  }
}

run();
