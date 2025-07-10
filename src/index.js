const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync all models (creates tables if they don't exist)
    // For production, consider using migrations instead of sync()
    await sequelize.sync();
    console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database or start server:", error);
  }
}

startServer();
