import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

let nextId = 2;
const employees = new Map([[1, { id: 1, name: 'Demo Employee', age: 25, salary: 75000 }]]);

function validate(body) {
  return body && typeof body.name === 'string' && body.name.trim().length > 0
    && body.name.trim().length <= 100 && Number.isInteger(body.age)
    && body.age >= 18 && body.age <= 100
    && typeof body.salary === 'number' && Number.isFinite(body.salary) && body.salary >= 0;
}

function idFrom(req) {
  const id = Number(req.params.id);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

router.get('/', (_req, res) => res.json([...employees.values()]));

router.get('/:id', (req, res) => {
  const employee = employees.get(idFrom(req));
  return employee ? res.json(employee) : res.status(404).json({ error: 'Employee not found.' });
});

router.post('/', authenticate, (req, res) => {
  if (!validate(req.body)) return res.status(400).json({ error: 'Provide a name, integer age 18–100, and non-negative numeric salary.' });
  const employee = { id: nextId++, name: req.body.name.trim(), age: req.body.age, salary: req.body.salary };
  employees.set(employee.id, employee);
  res.status(201).json(employee);
});

router.put('/:id', authenticate, (req, res) => {
  const id = idFrom(req);
  if (!employees.has(id)) return res.status(404).json({ error: 'Employee not found.' });
  if (!validate(req.body)) return res.status(400).json({ error: 'Invalid employee fields.' });
  const employee = { id, name: req.body.name.trim(), age: req.body.age, salary: req.body.salary };
  employees.set(id, employee);
  res.json(employee);
});

router.delete('/:id', authenticate, (req, res) => {
  if (!employees.delete(idFrom(req))) return res.status(404).json({ error: 'Employee not found.' });
  res.status(204).end();
});

export default router;
