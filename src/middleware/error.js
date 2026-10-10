export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found.' });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status === 400 ? 400 : 500;
  res.status(status).json({ error: status === 400 ? 'Invalid JSON body.' : 'Server error.' });
}
