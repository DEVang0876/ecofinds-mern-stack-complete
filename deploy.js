#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing EcoFinds for deployment...');

const runCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute: ${command}`);
    return false;
  }
};

// Build client for production
console.log('\n🏗️  Building client for production...');
if (runCommand('npm run build', path.join(process.cwd(), 'client'))) {
  console.log('✅ Client build successful');
} else {
  console.error('❌ Client build failed');
  process.exit(1);
}

// Run server tests
console.log('\n🧪 Running server tests...');
if (runCommand('npm test', path.join(process.cwd(), 'server'))) {
  console.log('✅ Server tests passed');
} else {
  console.warn('⚠️  Server tests failed or no tests found');
}

// Run client tests
console.log('\n🧪 Running client tests...');
if (runCommand('npm test -- --coverage --watchAll=false', path.join(process.cwd(), 'client'))) {
  console.log('✅ Client tests passed');
} else {
  console.warn('⚠️  Client tests failed or no tests found');
}

console.log('\n📦 Creating deployment package...');

// Create deployment instructions
const deployInstructions = `
# EcoFinds Deployment Instructions

## Backend Deployment
1. Set production environment variables
2. Deploy to your preferred platform (Heroku, Railway, DigitalOcean, etc.)
3. Configure MongoDB Atlas or production database
4. Set NODE_ENV=production

## Frontend Deployment
1. The build folder is ready for deployment
2. Deploy to Netlify, Vercel, or your preferred hosting service
3. Set REACT_APP_API_URL to your backend URL

## Required Environment Variables
- NODE_ENV=production
- PORT (set by hosting platform)
- MONGODB_URI (production database URL)
- JWT_SECRET (strong secret key)
- CLIENT_URL (frontend URL)

## Post-Deployment
1. Test all functionality
2. Monitor logs for errors
3. Set up monitoring and alerts
`;

fs.writeFileSync('DEPLOYMENT.md', deployInstructions);

console.log('✅ Deployment preparation completed!');
console.log('\n📝 Next steps:');
console.log('   1. Check DEPLOYMENT.md for deployment instructions');
console.log('   2. Configure production environment variables');
console.log('   3. Deploy backend and frontend to your hosting platforms');