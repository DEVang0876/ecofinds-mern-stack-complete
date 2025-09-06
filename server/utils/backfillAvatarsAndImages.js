// Script: backfillAvatarsAndImages.js
// Purpose: Populate missing user avatars and product image URLs with curated Unsplash links.
// Usage: node server/utils/backfillAvatarsAndImages.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/database');

// Curated avatar images (royalty-free Unsplash profile style)
const avatarPool = [
  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=60',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=60'
];

// Category-based fallback images (two each for gallery feel)
const categoryImages = {
  Clothing: [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1610375461246-83df859d9c1b?auto=format&fit=crop&w=800&q=60'
  ],
  Electronics: [
    'https://images.unsplash.com/photo-1603899123225-287d08b0b09d?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=60'
  ],
  Furniture: [
    'https://images.unsplash.com/photo-1582582494700-1c79a86b5a10?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=60'
  ],
  Books: [
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=60'
  ],
  Sports: [
    'https://images.unsplash.com/photo-1508974239320-0a0a6a8309da?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=800&q=60'
  ],
  default: [
    'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=60'
  ]
};

async function run() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Users without non-placeholder avatar
    const users = await User.find({ $or: [ { avatar: { $exists: false } }, { avatar: /placeholder/ } ] });
    let u = 0;
    for (const user of users) {
      user.avatar = avatarPool[u % avatarPool.length];
      await user.save();
      u++;
    }
    console.log(`Updated ${u} user avatars.`);

    // Products missing images or having placeholder only
    const products = await Product.find({ $or: [ { images: { $exists: false } }, { images: { $size: 0 } }, { 'images.0.url': /placeholder/ } ] });
    let p = 0;
    for (const product of products) {
      const list = categoryImages[product.category] || categoryImages.default;
      product.images = list.map((url, idx) => ({ url, alt: product.title + (idx ? ' alt ' + idx : '') }));
      await product.save();
      p++;
    }
    console.log(`Updated ${p} products with images.`);
  } catch (err) {
    console.error('Backfill error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected.');
  }
}

run();
