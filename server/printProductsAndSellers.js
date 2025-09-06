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
    const seller = await User.findOne({ email: 'seller@ecofinds.com' });

    console.log('TestUser:', testUser?._id?.toString());
    console.log('Seller:', seller?._id?.toString());

    const products = await Product.find({}).select('title seller').populate('seller', 'email username');
    console.log('Products:');
    products.forEach(p => {
      console.log('-', p._id.toString(), p.title, '->', p.seller?.email || p.seller?.toString());
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
