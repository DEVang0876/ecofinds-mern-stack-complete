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
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=60'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '0987654321',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=60'
  },
  {
    username: 'admin',
    email: 'admin@ecofinds.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=60'
  },
  {
    username: 'testuser',
    email: 'testuser@ecofinds.com',
    password: 'testpass123',
    firstName: 'Test',
    lastName: 'User',
    phone: '5555555555',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=60'
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
  location: { city: 'New York', state: 'NY' },
  images: [
    { url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=60', alt: 'Vintage Leather Jacket Front' },
    { url: 'https://images.unsplash.com/photo-1610375461246-83df859d9c1b?auto=format&fit=crop&w=800&q=60', alt: 'Vintage Leather Jacket Detail' }
  ]
  },
  {
    title: 'iPhone 12 Pro',
    description: 'Used iPhone 12 Pro in great condition. Includes charger and case.',
    price: 699.99,
    category: 'Electronics',
    condition: 'Like New',
    tags: ['iphone', 'smartphone', 'apple', 'mobile'],
  location: { city: 'Los Angeles', state: 'CA' },
  images: [
    { url: 'https://images.unsplash.com/photo-1603899123225-287d08b0b09d?auto=format&fit=crop&w=800&q=60', alt: 'iPhone 12 Pro Front' },
    { url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=60', alt: 'iPhone 12 Pro Back' }
  ]
  },
  {
    title: 'Wooden Coffee Table',
    description: 'Beautiful handcrafted wooden coffee table. Minor scratches but very sturdy.',
    price: 150.00,
    category: 'Furniture',
    condition: 'Good',
    tags: ['furniture', 'table', 'wood', 'home'],
  location: { city: 'Chicago', state: 'IL' },
  images: [
    { url: 'https://images.unsplash.com/photo-1582582494700-1c79a86b5a10?auto=format&fit=crop&w=800&q=60', alt: 'Wooden Coffee Table' },
    { url: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=60', alt: 'Coffee Table Angle' }
  ]
  },
  {
    title: 'Programming Books Collection',
    description: 'Collection of 10 programming books including JavaScript, Python, and React.',
    price: 75.00,
    category: 'Books',
    condition: 'Good',
    tags: ['books', 'programming', 'education', 'coding'],
  location: { city: 'Seattle', state: 'WA' },
  images: [
    { url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=60', alt: 'Programming Books Stack' },
    { url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=60', alt: 'Coding Books Spread' }
  ]
  },
  {
    title: 'Mountain Bike',
    description: 'Trek mountain bike in excellent condition. Perfect for trails and city riding.',
    price: 450.00,
    category: 'Sports',
    condition: 'Like New',
    tags: ['bike', 'mountain', 'cycling', 'sports'],
  location: { city: 'Denver', state: 'CO' },
  images: [
    { url: 'https://images.unsplash.com/photo-1508974239320-0a0a6a8309da?auto=format&fit=crop&w=800&q=60', alt: 'Mountain Bike Side' },
    { url: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=800&q=60', alt: 'Mountain Bike Detail' }
  ]
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