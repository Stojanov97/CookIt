const mongoose = require("mongoose");

const ItemScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    By: {
      name: { type: String, required: true },
      id: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
); // Schema for the recipe collection
// The schema is used to define the structure of the documents in the collection

const recipe = mongoose.model("recipe", ItemScheme, "Recipes"); // Model for the recipe collection
// The model is used to interact with the collection in the database

const create = async (data) => {
  try {
    let Recipe = new recipe(data); // Create a new recipe object
    return await Recipe.save(); // Save the recipe object to the database
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await recipe.find(); // Read all the recipes from the database
  } catch (err) {
    throw new Error(err);
  }
};

const readByID = async (id) => {
  try {
    return await recipe.findOne({ _id: id }); // Read a recipe by its ID from the database
  } catch (err) {
    throw new Error(err);
  }
};

const readByUserID = async (id) => {
  try {
    return await recipe.find({ "By.id": id }); // Read all the recipes by a user ID from the database
  } catch (err) {
    throw new Error(err);
  }
};

const readByIngredients = async (ing) => {
  try {
    return await recipe.find({ ingredients: ing }); // Read all the recipes by ingredients from the database
  } catch (err) {
    throw new Error(err);
  }
};

const readByCategory = async (cat) => {
  try {
    return await recipe.find({ category: cat }); // Read all the recipes by category from the database
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (id, data) => {
  try {
    return await recipe.updateOne({ _id: id }, data); // Update a recipe by its ID in the database
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (id) => {
  try {
    return await recipe.deleteOne({ _id: id }); // Remove a recipe by its ID from the database
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  create,
  read,
  readByID,
  readByUserID,
  readByIngredients,
  readByCategory,
  update,
  remove,
};
