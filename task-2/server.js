require('dotenv').config();

const express = require('express');
const http = require('http');
const websocket = require('ws');
const cors = require('cors');


const app = express();
app.use(cors());

const server = http.createServer(app);
const wss  = new websocket.Server({ server});

let document = "";
//handle websocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send the current document state to the newly connected client
    ws.send(JSON.stringify({ type: 'init', data: document }));
    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);
            if (msg.type === 'update') {
                // Update the document state
                document = msg.data;
                // Broadcast the updated document to all connected clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === websocket.OPEN) {    
                        client.send(JSON.stringify({ type: 'update', data: document }));
                    }
                });
        }
        } catch (error) {
            console.error('Error processing message:', error);
        }   
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});