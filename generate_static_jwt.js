const jwt = require('jsonwebtoken');

// Generate a token without an expiration (expiresIn) claim
const token = jwt.sign({ scope: "admin", userId: "spag" }, process.env.ADMIN_SECRET_KEY);

console.log(token);