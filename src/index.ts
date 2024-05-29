import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import customerRoutes from './routes/customers';

dotenv.config();

const { MONGO_URL, PORT } = process.env;

mongoose.connect(MONGO_URL as string)
  .then(() => {
    const app = express();
    app.use(express.json());

    // Use customer routes
    app.use('/api/customers', customerRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send({ message: err.message });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
