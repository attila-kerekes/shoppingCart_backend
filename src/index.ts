import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import path from 'path';
import aldiProductRoutes from './routes/aldiProductRoutes.js';

dotenv.config();

const { MONGO_URL, PORT } = process.env;

mongoose.connect(MONGO_URL as string)
  .then(() => {
    const app = express();

    // Serve static files from the public directory
    app.use('/images', express.static(path.join(__dirname, 'public/images')));
    
    // Middleware to parse JSON
    app.use(express.json());

    // Use product routes
    app.use('/api/products', productRoutes);

    // Use aldi product routes
    app.use('/api/aldi', aldiProductRoutes);

    // Error handling middleware
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
