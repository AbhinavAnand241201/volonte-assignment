// Security middleware for the API
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import express from 'express';

// Configure rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { errorMessage: 'Too many requests, please try again later.' }
});

// Combined security middleware
export const securityMiddleware = [
  // Use Helmet for security headers
  helmet(),
  
  // Enable CORS for frontend access
  cors(),
  
  // Parse JSON bodies
  express.json({ limit: '10kb' }),
  
  // Apply rate limiting to all requests
  limiter
];