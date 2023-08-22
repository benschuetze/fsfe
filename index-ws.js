const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("server started on port 3000");
});

process.on("SIGINT", () => {
  console.log("sigint");
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutDownDB();
  });
});

/** Websocket */

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log("Clients connected: ", numClients);

  wss.broadcast(`Current visitors:${numClients} `);

  if (ws.readyState === ws.OPEN) ws.send("welcome to my server!");

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${numClients}, datetime('now'))
  `);

  ws.on("close", () => {
    console.log("client has disconnected");
    wss.broadcast("Current visitors: ", numClients);
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

/** end websockets */

/**begin database */

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER, 
      time TEXT
    )
       `);
});

const getCounts = () => {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log("row: ", row);
  });
};

const shutDownDB = () => {
  getCounts();
  console.log("Shutting down db.");
  db.close();
};
