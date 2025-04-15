const {
  create,
  read,
  readByID,
  readByUserID,
  readByCategory,
  readByIngredients,
  update,
  remove,
} = require("../../../pkg/recipes"); // Import recipe-related operations
const { ItemCreate, ItemUpdate } = require("../../../pkg/recipes/validate"); // Import validation schemas for recipes
const { validate } = require("../../../pkg/validator"); // Import validation utility
const {
  upload,
  downloadAll,
  updateFile,
  removeFile,
  downloadByID,
} = require("../../../pkg/files"); // Import file handling utilities

// Handler to create a new recipe
const createHandler = async (req, res) => {
  try {
    // Prepare recipe data from request body
    let data = {
      name: req.body.name,
      category: req.body.category,
      instructions: req.body.instructions,
      ingredients: JSON.parse(req.body.ingredients), // Parse ingredients from JSON string
      By: { id: req.body.userID, name: req.body.userName }, // User info
    };
    await validate(data, ItemCreate); // Validate recipe data
    let recipe = await create(data); // Save recipe to database
    req.files && upload(req.files.photo, "recipe", recipe._id); // Upload photo if provided
    return await res.json({ success: true }); // Respond with success
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to fetch all recipes
const readHandler = async (req, res) => {
  try {
    let recipes = await read(); // Fetch all recipes
    let photos = await downloadAll("recipe"); // Fetch all recipe photos
    recipes = recipes.map((recipe) => {
      return {
        ...recipe._doc, // Merge recipe data
        ...{
          photo: photos.find(({ id }) => recipe._doc._id == id) || false, // Attach photo if available
        },
      };
    });
    return await res.json(recipes); // Respond with recipes
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to fetch a recipe by its ID
const readByIDHandler = async (req, res) => {
  try {
    let { id } = req.params; // Extract recipe ID from request params
    let recipe = await readByID(id); // Fetch recipe by ID
    let photos = await downloadByID("recipe", id); // Fetch photo for the recipe
    recipe = {
      ...recipe._doc, // Merge recipe data
      ...{
        photo: photos || false, // Attach photo if available
      },
    };
    return await res.json(recipe); // Respond with recipe
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to fetch recipes by category
const readByCategoryHandler = async (req, res) => {
  try {
    let { category } = req.params; // Extract category from request params
    let recipes = await readByCategory(category); // Fetch recipes by category
    let photos = await downloadAll("recipe"); // Fetch all recipe photos
    recipes = recipes.map((recipe) => {
      return {
        ...recipe._doc, // Merge recipe data
        ...{
          photo: photos.find(({ id }) => recipe._doc._id == id) || false, // Attach photo if available
        },
      };
    });
    return await res.json(recipes); // Respond with recipes
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to fetch recipes by ingredients
const readByIngredientsHandler = async (req, res) => {
  try {
    let { ing } = req.params; // Extract ingredient from request params
    let recipes = await readByIngredients(ing); // Fetch recipes by ingredient
    let photos = await downloadAll("recipe"); // Fetch all recipe photos
    recipes = recipes.map((recipe) => {
      return {
        ...recipe._doc, // Merge recipe data
        ...{
          photo: photos.find(({ id }) => recipe._doc._id == id) || false, // Attach photo if available
        },
      };
    });
    return await res.json(recipes); // Respond with recipes
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to update a recipe
const updateHandler = async (req, res) => {
  try {
    const { user, id } = req.params; // Extract user ID and recipe ID from request params
    let recipe = await readByID(id); // Fetch recipe by ID
    if (user !== recipe.By.id)
      throw { code: 401, error: "You can't tinker with this recipe" }; // Check if user is authorized
    let data = {
      name: req.body.name,
      category: req.body.category,
      instructions: req.body.instructions,
      ingredients: JSON.parse(req.body.ingredients), // Parse ingredients from JSON string
      By: { id: req.body.userID, name: req.body.userName }, // User info
    };
    await validate(data, ItemUpdate); // Validate updated recipe data
    req.files && updateFile(req.files.photo, "recipe", id); // Update photo if provided
    if (req.body.removePhoto === "true") {
      await removeFile("recipe", id); // Remove photo if requested
    }
    await update(id, data); // Update recipe in database
    return await res.json({ success: true }); // Respond with success
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to delete a recipe
const deleteHandler = async (req, res) => {
  try {
    const { id, user } = req.params; // Extract recipe ID and user ID from request params
    let recipe = await readByID(id); // Fetch recipe by ID
    if (user !== recipe.By.id)
      throw { code: 401, error: "You can't tinker with this recipe" }; // Check if user is authorized
    await remove(id); // Remove recipe from database
    await removeFile("recipe", id); // Remove associated photo
    return await res.json({ success: true }); // Respond with success
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to fetch a recipe's image
const getImage = async (req, res) => {
  try {
    const path = await downloadByID("recipe", req.params.id); // Fetch image path by recipe ID
    return await res.sendFile(path, (err) => {
      if (err) {
        console.log(err); // Log errors if any
      }
    });
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler to fetch recipes created by a specific user
const getLength = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request params
    let recipes = await readByUserID(id); // Fetch recipes by user ID
    let photos = await downloadAll("recipe"); // Fetch all recipe photos
    recipes = recipes.map((recipe) => {
      return {
        ...recipe._doc, // Merge recipe data
        ...{
          photo: photos.find(({ id }) => recipe._doc._id == id) || false, // Attach photo if available
        },
      };
    });
    return res.json(recipes); // Respond with recipes
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Export all handlers
module.exports = {
  createHandler,
  readHandler,
  readByIDHandler,
  updateHandler,
  deleteHandler,
  readByCategoryHandler,
  readByIngredientsHandler,
  getImage,
  getLength,
};
