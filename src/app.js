import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';

export const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '16kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  const status = err.status === 400 ? 400 : 500;
  res.status(status).json({ error: status === 400 ? 'Invalid JSON body.' : 'Server error.' });
});
