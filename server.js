// Servidor de broadcast Valorant - sin dependencias. Uso: node server.js (Node 18+)
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 3000, PUB = path.join(__dirname, 'public');
const P = n => ({ name: n, agent: '', weapon: '', hp: 100, armor: 0 });
let state = { scene: 'select', map: 'ASCENT', score: [0, 0],
  teams: ['EQUIPO A', 'EQUIPO B'].map(name => ({ name, players: [1,2,3,4,5].map(i => P('Jugador ' + i)) })) };
const clients = new Set();
const push = () => clients.forEach(r => r.write(`data: ${JSON.stringify(state)}\n\n`));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/events') { // Server-Sent Events: el overlay escucha aquí
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(`data: ${JSON.stringify(state)}\n\n`); clients.add(res);
    return void req.on('close', () => clients.delete(res));
  }
  if (url === '/api/state' && req.method === 'POST') {
    let b = ''; req.on('data', d => b += d);
    return void req.on('end', () => { try { state = { ...state, ...JSON.parse(b) }; push(); res.end('ok'); } catch { res.writeHead(400); res.end(); } });
  }
  if (url === '/api/state') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(state)); }
  // Proxy a Riot VAL-MATCH-V1 (post-partida). Requiere production key: RIOT_API_KEY=... RIOT_REGION=eu
  if (url.startsWith('/api/riot/match/')) {
    const id = url.split('/').pop(), reg = process.env.RIOT_REGION || 'eu';
    return void fetch(`https://${reg}.api.riotgames.com/val/match/v1/matches/${id}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY || '' } })
      .then(async r => { res.writeHead(r.status, { 'Content-Type': 'application/json' }); res.end(await r.text()); })
      .catch(() => { res.writeHead(502); res.end(); });
  }
  const f = path.join(PUB, url === '/' ? 'control.html' : url);
  if (!f.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('404'); }
    res.setHeader('Content-Type', types[path.extname(f)] || 'text/plain'); res.end(d); });
}).listen(PORT, () => console.log(`Panel: http://localhost:${PORT}  |  Overlay (OBS): http://localhost:${PORT}/overlay.html`));
