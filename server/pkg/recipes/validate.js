const ItemCreate = {
  name: "required|string",
  category: "required|string",
  By: "required|object",
  ingredients: "required|array",
  instructions: "required|string",
};

const ItemUpdate = {
  name: "string",
  category: "string",
  By: "object",
  ingredients: "array",
  instructions: "string",
};

module.exports = {
  ItemCreate,
  ItemUpdate,
};
