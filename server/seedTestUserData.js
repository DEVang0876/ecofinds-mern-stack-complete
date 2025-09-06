const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const { sampleUsers } = require('./utils/seedData');

dotenv.config();

async function seedTestUserData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'testuser@ecofinds.com' });
    if (!testUser) throw new Error('Test user not found');

    // Add sample products for test user
    const sampleProducts = [
      {
        title: 'Eco Water Bottle',
        description: 'Reusable stainless steel water bottle.',
        price: 15.99,
        category: 'Home & Garden',
        seller: testUser._id,
        images: [{ url: 'https://via.placeholder.com/300x300?text=Water+Bottle', alt: 'Eco Water Bottle' }],
        condition: 'New',
        quantity: 10
      },
      {
        title: 'Organic Cotton T-Shirt',
        description: 'Soft, sustainable cotton t-shirt.',
        price: 22.5,
        category: 'Clothing',
        seller: testUser._id,
        images: [{ url: 'https://via.placeholder.com/300x300?text=T-Shirt', alt: 'Organic Cotton T-Shirt' }],
        condition: 'New',
        quantity: 20
      }
    ];
    await Product.deleteMany({ seller: testUser._id });
    const products = await Product.insertMany(sampleProducts);
    console.log('✅ Sample products added for test user');

    // Add cart for test user
    await Cart.deleteMany({ user: testUser._id });
    const cart = await Cart.create({
      user: testUser._id,
      items: [
        {
          product: products[0]._id,
          quantity: 2,
          price: products[0].price
        },
        {
          product: products[1]._id,
          quantity: 1,
          price: products[1].price
        }
      ],
      totalAmount: products[0].price * 2 + products[1].price,
      totalItems: 3
    });
    console.log('✅ Cart added for test user');

    // Add order for test user
    await Order.deleteMany({ buyer: testUser._id });
    await Order.create({
      buyer: testUser._id,
      items: [
        {
          product: products[0]._id,
          title: products[0].title,
          price: products[0].price,
          quantity: 2,
          seller: testUser._id
        },
        {
          product: products[1]._id,
          title: products[1].title,
          price: products[1].price,
          quantity: 1,
          seller: testUser._id
        }
      ],
      totalAmount: products[0].price * 2 + products[1].price,
      status: 'completed',
      shippingAddress: {
        street: '123 Green St',
        city: 'Eco City',
        state: 'CA',
        zipCode: '90001',
        country: 'USA'
      }
    });
    console.log('✅ Order added for test user');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding test user data:', err);
    process.exit(1);
  }
}

seedTestUserData();

REACT_APP_API_URL=http://localhost:5001/api
