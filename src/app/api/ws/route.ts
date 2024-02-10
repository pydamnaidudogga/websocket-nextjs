export function SOCKET(
  client: import('ws').WebSocket,
  request: import('http').IncomingMessage,
  server: import('ws').WebSocketServer,
) {
  console.log('A client connected!');
  
  client.on('message', message => {
    // Broadcast the received message to all clients
    server.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    });
  });

  client.on('close', () => {
    console.log('A client disconnected!');
  });
}
