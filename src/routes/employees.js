import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { openDb } from '../db.js';
import { validate, idFrom } from '../utils/validation.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const db = await openDb();
  const employees = await db.all('SELECT * FROM employees');
  res.json(employees);
});

router.get('/:id', async (req, res) => {
  const db = await openDb();
  const id = idFrom(req);
  if (!id) return res.status(404).json({ error: 'Employee not found.' });

  const employee = await db.get('SELECT * FROM employees WHERE id = ?', [id]);
  return employee ? res.json(employee) : res.status(404).json({ error: 'Employee not found.' });
});

router.post('/', authenticate, async (req, res) => {
  if (!validate(req.body)) return res.status(400).json({ error: 'Provide a name, integer age 18–100, and non-negative numeric salary.' });
  
  const db = await openDb();
  const result = await db.run('INSERT INTO employees (name, age, salary) VALUES (?, ?, ?)', 
    [req.body.name.trim(), req.body.age, req.body.salary]);
    
  const employee = await db.get('SELECT * FROM employees WHERE id = ?', [result.lastID]);
  res.status(201).json(employee);
});

router.put('/:id', authenticate, async (req, res) => {
  const id = idFrom(req);
  if (!id) return res.status(404).json({ error: 'Employee not found.' });
  if (!validate(req.body)) return res.status(400).json({ error: 'Invalid employee fields.' });
  
  const db = await openDb();
  const existing = await db.get('SELECT * FROM employees WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Employee not found.' });

  await db.run('UPDATE employees SET name = ?, age = ?, salary = ? WHERE id = ?',
    [req.body.name.trim(), req.body.age, req.body.salary, id]);
    
  const employee = await db.get('SELECT * FROM employees WHERE id = ?', [id]);
  res.json(employee);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = idFrom(req);
  if (!id) return res.status(404).json({ error: 'Employee not found.' });
  
  const db = await openDb();
  const result = await db.run('DELETE FROM employees WHERE id = ?', [id]);
  
  if (result.changes === 0) return res.status(404).json({ error: 'Employee not found.' });
  res.status(204).end();
});

export default router;
