require('dotenv').config();
const express = require('express');
const { createTables, seed } = require('./db');
const {
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const init = async () => {
  try {
    await createTables();
    await seed();
    console.log('Database seeded');
  }
};

  init();


