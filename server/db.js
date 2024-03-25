const pg = require("pg");
const { v4: uuidv4 } = require("uuid");

const client = new pg.Client({
  connectionString:
    process.env.DATABASE_URL || `postgres://localhost/${process.env.DB_NAME}`,
});

const createTables = async () => {
  try {
    await client.connect();

    const SQL = `
      DROP TABLE IF EXISTS Reservation;
      DROP TABLE IF EXISTS Customer;
      DROP TABLE IF EXISTS Restaurant;

      CREATE TABLE Customer (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE Restaurant (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE Reservation (
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES Restaurant(id) NOT NULL,
        customer_id UUID REFERENCES Customer(id) NOT NULL
      );
    `;
    await client.query(SQL);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

const createCustomer = async (name) => {
  try {
    const id = uuidv4();
    const SQL = "INSERT INTO Customer (id, name) VALUES ($1, $2) RETURNING *";
    const response = await client.query(SQL, [id, name]);
    return response.rows[0];
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

const createRestaurant = async (name) => {
  try {
    const id = uuidv4();
    const SQL = "INSERT INTO Restaurant (id, name) VALUES ($1, $2) RETURNING *";
    const response = await client.query(SQL, [id, name]);
    return response.rows[0];
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw error;
  }
};

const createReservation = async ({
  customer_id,
  restaurant_id,
  date,
  party_count,
}) => {
  try {
    const id = uuidv4();
    const SQL =
      "INSERT INTO Reservation (id, date, party_count, restaurant_id, customer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const response = await client.query(SQL, [
      id,
      date,
      party_count,
      restaurant_id,
      customer_id,
    ]);
    return response.rows[0];
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

const fetchCustomers = async () => {
  try {
    const SQL = "SELECT * FROM Customer";
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

const fetchRestaurants = async () => {
  try {
    const SQL = "SELECT * FROM Restaurant";
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

const fetchReservations = async () => {
  try {
    const SQL = "SELECT * FROM Reservation";
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

const seed = async () => {
  try {
    await Promise.all([
      createCustomer("Afrakoma"),
      createCustomer("Adade"),
      createRestaurant("Papaye Eatery"),
      createRestaurant("Osu Diner"),
    ]);
    const customers = await fetchCustomers();
    const restaurants = await fetchRestaurants();
    await createReservation({
      customer_id: customers[0].id,
      restaurant_id: restaurants[0].id,
      date: new Date(),
      party_count: 5,
    });
    await createReservation({
      customer_id: customers[1].id,
      restaurant_id: restaurants[1].id,
      date: new Date(),
      party_count: 3,
    });
    console.log("Seed data added successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  seed,
};
