import http from 'http';
import { handleUserRequests } from './modules/users/user.router.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/users')) {
    handleUserRequests(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Resource not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
