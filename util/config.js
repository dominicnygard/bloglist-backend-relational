require("dotenv/config");

const DATABASE_URL = String(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3001;

module.exports = { DATABASE_URL, PORT };
