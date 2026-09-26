const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const readline = require('readline');

const SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const PORT = 8081;

// Create a JWT signed with the secret key 'doodoo'
const token = jwt.sign({ userId: "Spag", scope: "admin" }, SECRET_KEY);

const ws = new WebSocket(`wss://ws-survival.ericjmeier.com/?token=${encodeURIComponent(token)}`);

ws.on('open', () => {
  console.log("✅ Authenticated & Connected to Minecraft Server!");
  console.log("Type any command (e.g., 'list', 'say Hello world', 'time set day') and hit Enter.");
  console.log("Type 'exit' or 'quit' to close the connection.\n");

  // 1. Create interactive terminal interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'MC> '
  });

  rl.prompt();

  // 2. Listen for line input from terminal
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

  // 3. Print server outputs cleanly without breaking the prompt line
  ws.on('message', (data) => {
    // Clear current line to prevent overwriting the prompt text
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    console.log(`📥 ${data.toString()}`);
    rl.prompt();
  });

  ws.on('close', () => {
    console.log("\n❌ Server connection closed.");
    rl.close();
    process.exit(0);
  });
});

ws.on('error', (err) => {
  console.error("⚠️ Socket error:", err.message);
});