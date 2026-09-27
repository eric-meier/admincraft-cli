import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import * as readline from 'node:readline';

const SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const WS_URL = process.env.WS_URL;
const USERID = process.env.USERID;

const token = jwt.sign({ userId: USERID, scope: "admin" }, SECRET_KEY, { expiresIn: '4h' });

const ws = new WebSocket(`${WS_URL}/?token=${encodeURIComponent(token)}`);

ws.on('open', () => {
  console.log("Connected to admincraft websocket.");
  console.log("Type 'exit' or 'quit' to close the connection.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'MC> '
  });

  rl.prompt();

  rl.on('line', (input) => {
    const command = input.trim();

    if (command === 'exit' || command === 'quit') {
      console.log("Disconnecting...");
      rl.close();
      ws.close();
      return;
    }

    if (command) {
      ws.send(command);
    }

    rl.prompt();
  });

  ws.on('message', (data) => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    console.log(`${data.toString()}`);
    rl.prompt();
  });

  ws.on('close', () => {
    console.log("Server connection closed.");
    rl.close();
    process.exit(0);
  });
});

ws.on('error', (err) => {
  console.error("Socket error:", err.message);
});
