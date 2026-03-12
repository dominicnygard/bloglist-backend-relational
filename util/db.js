const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL, {});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database");
  } catch {
    console.log("Failed to connect to the database");
    process.exit(1);
  }
};

module.exports = { sequelize, connectToDatabase };
