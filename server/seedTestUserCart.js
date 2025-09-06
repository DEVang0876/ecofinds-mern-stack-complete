const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
dotenv.config();

async function seedTestUserCart() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'testuser@ecofinds.com' });
    if (!testUser) throw new Error('Test user not found');

    // Find products for test user
    const products = await Product.find({ seller: testUser._id });
    if (products.length === 0) throw new Error('No products found for test user');

    // Add cart for test user
    await Cart.deleteMany({ user: testUser._id });
    const cart = await Cart.create({
      user: testUser._id,
      items: products.map((product, idx) => ({
        product: product._id,
        quantity: idx + 1,
        price: product.price
      })),
      totalAmount: products.reduce((sum, p, idx) => sum + p.price * (idx + 1), 0),
      totalItems: products.length
    });
    console.log('✅ Cart added for test user');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding test user cart:', err);
    process.exit(1);
  }
}

seedTestUserCart();
