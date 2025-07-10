require("dotenv").config();
const express = require("express");
const identityRoutes = require("./routes/identity.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Bitespeed Identity Service is running.");
});
app.use("/", identityRoutes);

module.exports = app;
