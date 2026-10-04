import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const port = Number(process.env.PORT || 4173);
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(rootDir, 'sample-app', 'index.html');

const metrics = { coverage: 82, apiHealth: 'Green', p95LatencyMs: 640 };
const securityHeaders = { 'X-Content-Type-Options': 'nosniff' };

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
  });
}

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...securityHeaders });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const url = (req.url || '/').split('?')[0];
  const method = req.method || 'GET';

  if (url === '/api/metrics' && method === 'GET') {
    json(res, 200, metrics);
    return;
  }
  if (url === '/api/feedback' && method === 'POST') {
    let body = {};
    try {
      body = JSON.parse((await readBody(req)) || '{}');
    } catch {
      /* fall through to 400 */
    }
    if (!body.name || !body.email || !String(body.email).includes('@')) {
      json(res, 400, { error: 'Name and a valid email are required' });
      return;
    }
    json(res, 200, { ok: true, id: 'fb-123' });
    return;
  }
  if (url === '/api/login' && method === 'POST') {
    let body = {};
    try {
      body = JSON.parse((await readBody(req)) || '{}');
    } catch {
      /* fall through to 401 */
    }
    if (body.username === 'admin' && body.password === 'secret') {
      json(res, 200, { ok: true, token: 'demo-token' });
      return;
    }
    json(res, 401, { error: 'Invalid credentials' });
    return;
  }
  if (url === '/api/upload' && method === 'POST') {
    const raw = await readBody(req);
    const match = /filename="([^"]+)"/.exec(raw);
    json(res, 200, { ok: true, filename: match ? match[1] : 'unknown' });
    return;
  }
  if (url.startsWith('/api/')) {
    json(res, 404, { error: 'Not found' });
    return;
  }
  const html = await readFile(appPath, 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...securityHeaders });
  res.end(html);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Sample app running at http://127.0.0.1:${port}`);
});
