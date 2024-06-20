const mongoose = require("mongoose");
require("dotenv").config();
const connectionDB = async () => {
  try {
    const dbURL = process.env.DB_URL;

    await mongoose.connect(dbURL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  connectionDB: connectionDB,
};
