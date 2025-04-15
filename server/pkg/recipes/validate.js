const ItemCreate = {
  name: "required|string",
  category: "required|string",
  By: "required|object",
  ingredients: "required|array",
  instructions: "required|string",
}; // Validation rules for creating a recipe

const ItemUpdate = {
  name: "string",
  category: "string",
  By: "object",
  ingredients: "array",
  instructions: "string",
}; // Validation rules for updating a recipe
// The rules are used to validate the data before saving it to the database

module.exports = {
  ItemCreate,
  ItemUpdate,
};
