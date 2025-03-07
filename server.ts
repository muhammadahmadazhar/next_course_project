// server.js (root of your project)

// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// const { getSocketServer } = require('./lib/socketio-server');

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { getSocketServer } from "./lib/socketio-server"

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Initialize Socket.IO with the HTTP server
  getSocketServer(server);

  server.on('request', (req, res) => {
    if (req.url === '/api/health') {
      res.writeHead(200);
      res.end('OK');
    }
  });

  server.listen(port, () => {
    // if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});


// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// const { Server } = require("socket.io");

// import { createServer } from "http";
// import { parse } from "url";
// import next from "next";
// import { Server } from "socket.io";

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     const parsedUrl = parse(req.url, true);
//     handle(req, res, parsedUrl);
//   });

//   const io = new Server(server);

//   io.on('connection', (socket) => {
//     console.log('A client connected');

//     socket.on('disconnect', () => {
//       console.log('A client disconnected');
//     });
//   });

//   server.listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3000');
//   });
// });