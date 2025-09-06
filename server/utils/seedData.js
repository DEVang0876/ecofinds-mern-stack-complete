const User = require('../models/User');
const Product = require('../models/Product');

// Sample users data
const sampleUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '1234567890',
    role: 'user'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '0987654321',
    role: 'user'
  },
  {
    username: 'admin',
    email: 'admin@ecofinds.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    username: 'testuser',
    email: 'testuser@ecofinds.com',
    password: 'testpass123',
    firstName: 'Test',
    lastName: 'User',
    phone: '5555555555',
    role: 'user'
  }
];

// Sample products data
const sampleProducts = [
  {
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Perfect for casual wear.',
    price: 89.99,
    category: 'Clothing',
    condition: 'Good',
    tags: ['vintage', 'leather', 'jacket', 'fashion'],
    location: { city: 'New York', state: 'NY' }
  },
  {
    title: 'iPhone 12 Pro',
    description: 'Used iPhone 12 Pro in great condition. Includes charger and case.',
    price: 699.99,
    category: 'Electronics',
    condition: 'Like New',
    tags: ['iphone', 'smartphone', 'apple', 'mobile'],
    location: { city: 'Los Angeles', state: 'CA' }
  },
  {
    title: 'Wooden Coffee Table',
    description: 'Beautiful handcrafted wooden coffee table. Minor scratches but very sturdy.',
    price: 150.00,
    category: 'Furniture',
    condition: 'Good',
    tags: ['furniture', 'table', 'wood', 'home'],
    location: { city: 'Chicago', state: 'IL' }
  },
  {
    title: 'Programming Books Collection',
    description: 'Collection of 10 programming books including JavaScript, Python, and React.',
    price: 75.00,
    category: 'Books',
    condition: 'Good',
    tags: ['books', 'programming', 'education', 'coding'],
    location: { city: 'Seattle', state: 'WA' }
  },
  {
    title: 'Mountain Bike',
    description: 'Trek mountain bike in excellent condition. Perfect for trails and city riding.',
    price: 450.00,
    category: 'Sports',
    condition: 'Like New',
    tags: ['bike', 'mountain', 'cycling', 'sports'],
    location: { city: 'Denver', state: 'CO' }
  }
];

// Seed database function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Add seller reference to products and create them
    const productsWithSellers = sampleProducts.map((product, index) => ({
      ...product,
      seller: users[index % users.length]._id // Distribute products among users
    }));

    const products = await Product.create(productsWithSellers);
    console.log(`✅ Created ${products.length} products`);

    console.log('🎉 Database seeded successfully!');
    console.log('\nDefault Admin Credentials:');
    console.log('Email: admin@ecofinds.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase, sampleUsers, sampleProducts };