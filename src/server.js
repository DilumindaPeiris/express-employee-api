import { app } from './app.js';
import { openDb } from './db.js';

const PORT = process.env.PORT || 3000;
openDb().then(() => {
  app.listen(PORT, '127.0.0.1', () => console.log(`API: http://localhost:${PORT}/api/employees`));
});
