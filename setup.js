#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up EcoFinds MERN Stack Application...');

// Function to run commands
const runCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute: ${command}`);
    return false;
  }
};

// Check if Node.js and npm are installed
console.log('\n📋 Checking prerequisites...');
try {
  execSync('node --version', { stdio: 'pipe' });
  execSync('npm --version', { stdio: 'pipe' });
  console.log('✅ Node.js and npm are installed');
} catch (error) {
  console.error('❌ Node.js and npm are required. Please install them first.');
  process.exit(1);
}

// Check if MongoDB is available
console.log('\n📋 Checking MongoDB...');
try {
  execSync('mongod --version', { stdio: 'pipe' });
  console.log('✅ MongoDB is installed');
} catch (error) {
  console.warn('⚠️  MongoDB not found. Please install MongoDB locally.');
  console.log('   Download from: https://www.mongodb.com/try/download/community');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

// Install main project dependencies
if (runCommand('npm install')) {
  console.log('✅ Main dependencies installed');
} else {
  console.error('❌ Failed to install main dependencies');
  process.exit(1);
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
if (runCommand('npm install', path.join(process.cwd(), 'server'))) {
  console.log('✅ Server dependencies installed');
} else {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
if (runCommand('npm install', path.join(process.cwd(), 'client'))) {
  console.log('✅ Client dependencies installed');
} else {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}

// Create uploads directory
const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Check if .env file exists
const envFile = path.join(process.cwd(), 'server', '.env');
if (!fs.existsSync(envFile)) {
  console.log('\n⚠️  .env file not found in server directory');
  console.log('   Please create .env file with required environment variables');
  console.log('   Check server/README.md for required variables');
} else {
  console.log('✅ Environment file found');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📝 Next steps:');
console.log('   1. Make sure MongoDB is running locally');
console.log('   2. Configure environment variables in server/.env');
console.log('   3. Start the application with: npm run dev');
console.log('\n📚 For more information, check the README.md file');