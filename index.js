require("dotenv").config();
const express = require("express");

const { createTables, seed } = require("./server/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const init = async () => {
  try {
    await createTables();
    await seed();
    console.log("Database seeded");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

init();
