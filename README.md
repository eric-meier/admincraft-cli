# Admincraft CLI
This is a script to connect to an instance of [joanroig/admincraft-websocket](https://github.com/joanroig/admincraft-websocket) from a command line with Node.js.

## Usage
Create a file named `.env` in your working directory and define the following keys:
- `ADMIN_SECRET_KEY` - The key used to connect to the websocket
- `WS_URL` - The url of the websocket for example `wss://websocket.example.com` or `ws://<IP>:<PORT>`
- `USERID` - how you want to be identified in the admincraft logs.

With that file created, you can connect to the admincraft websocket with:

`node --env-file=.env interactive_connection.js`
