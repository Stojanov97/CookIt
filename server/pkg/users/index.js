const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
  },
  { timestamps: true }
); // Schema for the user collection
// The schema is used to define the structure of the documents in the collection

const User = mongoose.model("User", UserScheme, "Users"); // Model for the user collection

const create = async (credentials) => {
  try {
    const user = new User(credentials); // Create a new user object
    return await user.save(); // Save the user object to the database
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await User.find(); // Read all the users from the database
  } catch (err) {
    throw new Error(err);
  }
};

const readByID = async (ID) => {
  try {
    return await User.findOne({ _id: ID }); // Read a user by its ID from the database
  } catch (err) {
    throw new Error(err);
  }
};

const readByUsername = async (username) => {
  try {
    return await User.findOne({ username: username }); // Read a user by its username from the database
  } catch (err) {
    throw new Error(err);
  }
};

const readByEmail = async (email) => {
  try {
    return await User.findOne({ email: email }); // Read a user by its email from the database
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (ID, data) => {
  try {
    return await User.updateOne({ _id: ID }, data); // Update a user by its ID in the database
  } catch (err) {
    throw new Error(err);
  }
};

const changePassword = async (ID, newPassword) => {
  try {
    return await User.updateOne({ _id: ID }, { password: newPassword }); // Change the password of a user by its ID in the database
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (ID) => {
  try {
    return await User.deleteOne({ _id: ID }); // Remove a user by its ID from the database
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  readByUsername,
  readByEmail,
  readByID,
  update,
  changePassword,
  remove,
};
