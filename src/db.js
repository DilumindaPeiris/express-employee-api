import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbInstance = null;

export async function openDb() {
  if (dbInstance) return dbInstance;
  
  const filename = process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite';
  dbInstance = await open({
    filename,
    driver: sqlite3.Database
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      salary REAL NOT NULL
    )
  `);

  const count = await dbInstance.get('SELECT COUNT(*) as count FROM employees');
  if (count.count === 0) {
    await dbInstance.run('INSERT INTO employees (name, age, salary) VALUES (?, ?, ?)', ['Demo Employee', 25, 75000]);
  }

  return dbInstance;
}
