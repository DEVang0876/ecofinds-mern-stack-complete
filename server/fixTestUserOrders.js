const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
dotenv.config();

async function fixTestUserOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'testuser@ecofinds.com' });
    if (!testUser) throw new Error('Test user not found');

    // Update all orders to set buyer to testUser._id
    const result = await Order.updateMany({}, { $set: { buyer: testUser._id } });
    console.log(`✅ Updated ${result.modifiedCount || result.nModified} orders to set buyer to testuser`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error fixing test user orders:', err);
    process.exit(1);
  }
}

fixTestUserOrders();
