# EcoFinds Backend API

This is the backend API for the EcoFinds sustainable marketplace platform built with Node.js, Express.js, and MongoDB.

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Environment Variables

Create a `.env` file in the server root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## Quick Start

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start MongoDB service
4. Run the server: `npm run dev`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests

## Database Models

- **User** - User accounts and profiles
- **Product** - Product listings
- **Cart** - Shopping cart items
- **Order** - Purchase orders

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting
- CORS protection
- File upload security