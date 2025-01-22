const WebSocket = require('ws');

module.exports = () => {
  const wss = new WebSocket.Server({ port: 4000 });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      // Echo the message back to the client
      ws.send(message);
    });

    ws.on('close', () => {
      console.log('Connection closed');
    });
  });

  console.log('WebSocket server running on port 4000');
};
