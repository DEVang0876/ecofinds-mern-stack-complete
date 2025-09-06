# EcoFinds - Sustainable Second-Hand Marketplace

EcoFinds is a comprehensive MERN stack application that serves as a sustainable second-hand marketplace platform. It enables users to buy and sell pre-owned goods, promoting circular economy and sustainable consumption.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration, login, and logout with JWT
- **User Profile Management**: Complete dashboard with editable user information
- **Product Listing CRUD**: Create, read, update, and delete product listings
- **Product Browsing**: Browse products with search, filter, and category options
- **Shopping Cart**: Add products to cart and manage cart items
- **Order Management**: Complete order processing and purchase history
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Advanced Features
- **Category-based Organization**: Products organized in predefined categories
- **Search & Filter**: Advanced search with price range and condition filters
- **Image Upload**: Support for product images (placeholder implementation)
- **User Dashboard**: Comprehensive user profile and settings management
- **Previous Purchase History**: View all past orders and purchases
- **Real-time Updates**: Dynamic cart updates and product availability

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database (local installation required)
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **React Icons** - Icon components
- **React Toastify** - Notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0.0 or higher) - Local installation

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecofinds-mern-stack
```

### 2. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies  
npm run install-client
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ecofinds
DB_NAME=ecofinds

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads/

# Rate Limiting
RATE_LIMIT_WINDOWMS=900000
RATE_LIMIT_MAX=100
```

### 4. Database Setup

Make sure MongoDB is running locally on your machine:

```bash
# Start MongoDB service (varies by OS)
# On macOS with Homebrew:
brew services start mongodb/brew/mongodb-community

# On Ubuntu:
sudo systemctl start mongod

# On Windows:
# Start MongoDB as a Windows service or run mongod.exe
```

### 5. Seed Database (Optional)

To populate the database with sample data:

```bash
cd server
node -e "require('./utils/seedData').seedDatabase()"
```

### 6. Start the Application

#### Development Mode (Recommended)
```bash
# Run both frontend and backend concurrently
npm run dev
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start backend only
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 Application Structure

### Backend Structure
```
server/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # MongoDB/Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── uploads/        # File upload directory
└── server.js       # Main server file
```

### Frontend Structure
```
client/
├── public/         # Static files
└── src/
    ├── components/ # React components
    │   ├── auth/   # Authentication components
    │   ├── cart/   # Cart-related components
    │   ├── common/ # Shared components
    │   ├── dashboard/ # Dashboard components
    │   └── products/  # Product components
    ├── context/    # React Context providers
    ├── pages/      # Page components
    ├── services/   # API services
    ├── styles/     # CSS stylesheets
    └── utils/      # Utility functions
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)
- `GET /api/products/user/my-products` - Get user's products

### Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/add` - Add item to cart (auth required)
- `PUT /api/cart/update` - Update cart item (auth required)
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order (auth required)
- `GET /api/orders/my-orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get single order (auth required)
- `PUT /api/orders/:id/status` - Update order status

## 🎯 Usage Guide

### For Buyers
1. **Browse Products**: Visit the products page to explore available items
2. **Search & Filter**: Use search and filter options to find specific products
3. **View Details**: Click on products to see detailed information
4. **Add to Cart**: Add desired items to your shopping cart
5. **Checkout**: Complete the purchase through the cart page
6. **Track Orders**: Monitor your orders in the orders section

### For Sellers
1. **Create Account**: Register as a new user
2. **Add Products**: Use the "Add Product" page to list items for sale
3. **Manage Listings**: View and edit your products in "My Listings"
4. **Process Orders**: Manage incoming orders and update their status
5. **View Sales**: Track your sales history and earnings

### Admin Features
- User management and moderation
- Product oversight and control
- System analytics and reporting

## 🧪 Testing

The project includes comprehensive testing capabilities:

```bash
# Run backend tests
cd server && npm test

# Run frontend tests  
cd client && npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Configure MongoDB Atlas or production database
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **EcoFinds Team** - Full Stack Developers

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🎉 Acknowledgments

- Built with the MERN stack
- Inspired by sustainable commerce principles
- Community-driven development approach

---

**Happy Sustainable Shopping! 🌱♻️**