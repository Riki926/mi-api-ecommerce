// Load environment variables from .env file
require('dotenv').config();

module.exports = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || 30, // days
  
  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  SMTP_PORT: process.env.SMTP_PORT || 2525,
  SMTP_USER: process.env.SMTP_USER || 'your_smtp_user',
  SMTP_PASS: process.env.SMTP_PASS || 'your_smtp_password',
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'noreply@yourapp.com',
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'E-commerce App',
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  
  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // File upload
  MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD || 1000000, // 1MB
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || 'public/uploads',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'dev',
  
  // API Documentation
  API_DOCS_ENABLED: process.env.API_DOCS_ENABLED === 'true' || true
};
