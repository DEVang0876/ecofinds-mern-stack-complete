const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { sampleUsers } = require('./utils/seedData');

dotenv.config();

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Remove existing users with same emails/usernames
    const emails = sampleUsers.map(u => u.email);
    const usernames = sampleUsers.map(u => u.username);
    await User.deleteMany({ $or: [ { email: { $in: emails } }, { username: { $in: usernames } } ] });

    // Hash passwords and insert users
    const bcrypt = require('bcryptjs');
    const usersToInsert = await Promise.all(sampleUsers.map(async user => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    }));
    await User.insertMany(usersToInsert);
    console.log('✅ Sample users seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
}

seedUsers();
