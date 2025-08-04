import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { handlePostSensorData, setupWebSocketOnUpgrade } from './websocket/wsController';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, turbo: true, turbopack: true })
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (parsedUrl.pathname === '/api/ws') {
      res.writeHead(426, { 'Content-Type': 'text/plain' });
      res.end('Upgrade required for WebSocket');
    } else if (parsedUrl.pathname === '/api/send-sensor-data') {
      handlePostSensorData(req, res);
      return;
    } else {
      handle(req, res, parsedUrl);
    }
  });

  setupWebSocketOnUpgrade(server);

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
