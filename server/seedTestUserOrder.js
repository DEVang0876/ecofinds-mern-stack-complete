const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
dotenv.config();

async function seedTestUserOrder() {
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

    // Add order for test user
    await Order.deleteMany({ buyer: testUser._id });
    const order = new Order({
      buyer: testUser._id,
      items: products.map((product, idx) => ({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: idx + 1,
        seller: testUser._id
      })),
      status: 'delivered',
      shippingAddress: {
        street: '123 Green St',
        city: 'Eco City',
        state: 'CA',
        zipCode: '90001',
        country: 'USA'
      },
      orderNumber: 'ECO' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
    });
    order.calculateTotals();
    await order.save();
    console.log('✅ Order added for test user');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding test user order:', err);
    process.exit(1);
  }
}

seedTestUserOrder();
