import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

export const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '16kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
