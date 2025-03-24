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
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    },
  },
  { timestamps: true }
);

const recipe = mongoose.model("recipe", ItemScheme, "Recipes");

const create = async (data) => {
  try {
    let Recipe = new recipe(data);
    return await Recipe.save();
  } catch (err) {
    throw new Error(err);
  }
};

const read = async () => {
  try {
    return await recipe.find();
  } catch (err) {
    throw new Error(err);
  }
};

const readByID = async (id) => {
  try {
    return await recipe.findOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
};

const readByUserID = async (id) => {
  try {
    return await recipe.find({ "By.id": id });
  } catch (err) {
    throw new Error(err);
  }
};

const readByIngredients = async (ing) => {
  try {
    return await recipe.find({ ingredients: ing });
  } catch (err) {
    throw new Error(err);
  }
};

const readByCategory = async (cat) => {
  try {
    return await recipe.find({ category: cat });
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (id, data) => {
  try {
    return await recipe.updateOne({ _id: id }, data);
  } catch (err) {
    throw new Error(err);
  }
};

const remove = async (id) => {
  try {
    return await recipe.deleteOne({ _id: id });
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
