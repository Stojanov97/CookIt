require("dotenv").config();

let get = (section) => {
  // Function to get the environment variables from .env file
  return process.env[section] ? process.env[section] : "Non existing variable";
};

module.exports = {
  get,
};
