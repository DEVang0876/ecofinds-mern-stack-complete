const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    const testUser = await User.findOne({ email: 'testuser@ecofinds.com' });
    if (!testUser) throw new Error('Test user not found');

    let seller = await User.findOne({ email: 'seller@ecofinds.com' });
    if (!seller) {
      seller = new User({
        username: 'selleruser',
        email: 'seller@ecofinds.com',
        password: 'sellerpass123',
        firstName: 'Seller',
        lastName: 'One'
      });
      await seller.save();
      console.log('✅ Created seller user:', seller.email);
    } else {
      console.log('ℹ️ Seller user already exists:', seller.email);
    }

    // Reassign products that currently belong to testUser to the seller
    const result = await Product.updateMany(
      { seller: testUser._id },
      { $set: { seller: seller._id } }
    );

    console.log(`✅ Products reassigned from testUser to seller: ${result.modifiedCount}`);

    // Also reassign any products that have no seller (null/undefined) to the seller so there are items available
    const result2 = await Product.updateMany(
      { $or: [{ seller: { $exists: false } }, { seller: null }] },
      { $set: { seller: seller._id } }
    );

    console.log(`✅ Products reassigned from null to seller: ${result2.modifiedCount}`);

    // Optionally, re-create one product for testUser so they still have items
    // If needed, you can create additional products here.

    process.exit(0);
  } catch (err) {
    console.error('❌ Error in reassignProductsToSeller:', err);
    process.exit(1);
  }
}

run();
