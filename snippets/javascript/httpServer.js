// @codetype medium | Minimal JSON HTTP server with Node's http module
import { createServer } from 'node:http';

const users = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }];

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
