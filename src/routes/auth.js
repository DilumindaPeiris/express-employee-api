import express from 'express';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // For learning purposes, accept admin/admin
  if (username === 'admin' && password === 'admin') {
    const token = generateToken({ username, role: 'admin' });
    return res.json({ token });
  }
  
  return res.status(401).json({ error: 'Invalid credentials. Use admin/admin' });
});

export default router;
