/*
 * Connect to the MongoDB database
 */
const { MongoClient } = require('mongodb');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST;

/* initial database connection */
const connect = async () => {
  try {
    const client = await MongoClient.connect(
      DB_HOST,
      { useNewUrlParser: true }
    );
    return client.db();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connect;
