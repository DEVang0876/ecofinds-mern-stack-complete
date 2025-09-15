const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
dotenv.config();

async function seedDjmkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await User.findOne({ email: 'djmk@gmail.com' });
    if (!user) throw new Error('User not found');
    const products = await Product.find().limit(5);
    if (products.length === 0) throw new Error('No products found');

    const orders = [];
    for (let i = 0; i < 5; i++) {
      const product = products[i % products.length];
      orders.push({
        buyer: user._id,
        items: [{
          product: product._id,
          title: product.title,
          price: product.price,
          quantity: 1,
          seller: product.seller
        }],
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        totalItems: 1,
        totalAmount: product.price,
        shippingAddress: {
          street: '123 Main St',
          city: 'Sample City',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        },
        orderNumber: 'DJMK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase(),
        createdAt: new Date(Date.now() - (i+1)*86400000),
        updatedAt: new Date(Date.now() - (i+1)*86400000)
      });
    }
    await Order.insertMany(orders);
    console.log('✅ 5 sample orders added for djmk@gmail.com');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seedDjmkOrders();