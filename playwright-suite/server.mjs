import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const port = Number(process.env.PORT || 4173);
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(rootDir, 'sample-app', 'index.html');

const metrics = { coverage: 82, apiHealth: 'Green', p95LatencyMs: 640 };
const securityHeaders = { 'X-Content-Type-Options': 'nosniff' };

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  if (url === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json', ...securityHeaders });
    res.end(JSON.stringify(metrics));
    return;
  }
  if (url.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json', ...securityHeaders });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }
  const html = await readFile(appPath, 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...securityHeaders });
  res.end(html);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Sample app running at http://127.0.0.1:${port}`);
});
