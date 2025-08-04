import { Server as HTTPServer, IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'url';

interface SensorData {
  timestamp: string;
  sensors: {
    name: string;
    value: string;
    unit: string;
  }[];
}

let wss: WebSocketServer | null = null;
let latestSensorData: SensorData | null = null;

// const generateSensorData = (): SensorData => ({
//   timestamp: new Date().toISOString(),
//   temperature: (36 + Math.random() * 2).toFixed(1),
//   spo2: (95 + Math.random() * 5).toFixed(0),
//   heartrate: (60 + Math.random() * 40).toFixed(0),
//   blood_pressure: `${110 + Math.floor(Math.random() * 10)}/${70 + Math.floor(Math.random() * 10)}`,
// });

export const handlePostSensorData = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'POST' && parse(req.url || '').pathname === '/api/send-sensor-data') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        body = body.trim();
        const data = JSON.parse(body);
        console.log(data);

        const requiredFields = ['Temperature', 'SPO2', 'Heart Rate', 'Blood Pressure'];
        const hasAllFields = requiredFields.every((field) =>
          data.some((item: any) => item.name === field && item.value && item.unit)
        );

        if (!hasAllFields || data.length !== requiredFields.length){
          throw new Error('Invalid sensor data format or missing fields');
        }

        latestSensorData = {
          timestamp: new Date().toISOString(),
          sensors: data,
        };

        if (wss) {
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'sensor_data',
                  data: latestSensorData,
                })
              );
            }
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Sensor data received successfully' }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
  }
};

export const setupWebSocketOnUpgrade = (server: HTTPServer) => {
  wss = new WebSocketServer({ noServer: true });
  if (!wss) return;

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url || '');

    if (pathname === '/api/ws') {
      wss!.handleUpgrade(req, socket, head, (ws) => {
        wss!.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('✅ Client connected to /api/ws');

    ws.send(
      JSON.stringify({
        type: 'connection',
        message: 'Connected to real-time sensor server',
      })
    );

    // const intervalId = setInterval(() => {
    //   if (ws.readyState === WebSocket.OPEN && latestSensorData) {
    //     const data = {
    //       type: 'sensor_data',
    //       data: latestSensorData,
    //     };
    //     ws.send(JSON.stringify(data));
    //   }
    // }, 5000);

    (ws as any).isAlive = true;

    ws.on('pong', () => {
      (ws as any).isAlive = true;
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      // clearInterval(intervalId);
    });

    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      // clearInterval(intervalId);
    });
  });

  // Heartbeat to keep connections alive
  const pingInterval = setInterval(() => {
    wss!.clients.forEach((ws: WebSocket) => {
      if (!(ws as any).isAlive) return ws.terminate();
      (ws as any).isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(pingInterval));
};
