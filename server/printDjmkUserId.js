const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

async function printDjmkUserId() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await User.findOne({ email: 'djmk@gmail.com' });
    if (!user) throw new Error('User not found');
    console.log('User ID for djmk@gmail.com:', user._id);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

printDjmkUserId();