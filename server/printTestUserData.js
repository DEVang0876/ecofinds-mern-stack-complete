const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
dotenv.config();

async function printTestUserData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'testuser@ecofinds.com' });
    if (!testUser) throw new Error('Test user not found');

    // Print products for test user
    const products = await Product.find({ seller: testUser._id });
    console.log('Products for testuser:', products);

    // Print cart for test user
    const cart = await Cart.findOne({ user: testUser._id }).populate('items.product');
    console.log('Cart for testuser:', cart);

    // Print orders for test user
    const orders = await Order.find({ buyer: testUser._id });
    console.log('Orders for testuser:', orders);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error printing test user data:', err);
    process.exit(1);
  }
}

printTestUserData();
