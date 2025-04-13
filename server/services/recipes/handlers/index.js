const config = require("../../../pkg/config").get;
const {
  create,
  read,
  readByID,
  readByUserID,
  readByCategory,
  readByIngredients,
  update,
  remove,
} = require("../../../pkg/recipes");
const { ItemCreate, ItemUpdate } = require("../../../pkg/recipes/validate");
const { validate } = require("../../../pkg/validator");
const {
  upload,
  downloadAll,
  updateFile,
  removeFile,
  downloadByID,
} = require("../../../pkg/files");

const createHandler = async (req, res) => {
  try {
    console.log(req.files);
    let data = {
      name: req.body.name,
      category: req.body.category,
      instructions: req.body.instructions,
      ingredients: JSON.parse(req.body.ingredients),
      By: { id: req.body.userID, name: req.body.userName },
    };
    await validate(data, ItemCreate);
    let recipe = await create(data);
    req.files && upload(req.files.photo, "recipe", recipe._id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readHandler = async (req, res) => {
  try {
    let recipes = await read();
    let photos = await downloadAll("recipe");
    recipes = recipes.map((recipe) => {
      return {
        ...recipe._doc,
        ...{
          photo: photos.find(({ id }) => recipe._doc._id == id) || false,
        },
      };
    });
    return await res.json(recipes);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readByIDHandler = async (req, res) => {
  try {
    let { id } = req.params;
    let recipe = await readByID(id);
    let photos = await downloadByID("recipe", id);
    recipe = {
      ...recipe._doc,
      ...{
        photo: photos || false,
      },
    };
    return await res.json(recipe);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readByCategoryHandler = async (req, res) => {
  try {
    let { category } = req.params;
    let recipes = await readByCategory(category);
    let photos = await downloadAll("recipe");
    recipes = recipes.map((recipe) => {
      return {
        ...recipe._doc,
        ...{
          photo: photos.find(({ id }) => recipe._doc._id == id) || false,
        },
      };
    });
    return await res.json(recipes);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};
const readByIngredientsHandler = async (req, res) => {
  try {
    let { ing } = req.params;
    let recipes = await readByIngredients(ing);
    let photos = await downloadAll("recipe");
    recipes = recipes.map((recipe) => {
      return {
        ...recipe._doc,
        ...{
          photo: photos.find(({ id }) => recipe._doc._id == id) || false,
        },
      };
    });
    return await res.json(recipes);
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    let recipe = await readByID(id);
    const { user, id } = req.params;
    if (user !== recipe.By.id)
      throw { code: 401, error: "You can't tinker with this recipe" };
    let data = {
      name: req.body.name,
      category: req.body.category,
      instructions: req.body.instructions,
      ingredients: req.body.ingredients,
      By: { id: user },
    };
    await validate(data, ItemUpdate);
    req.files && updateFile(req.files.photo, "recipe", id);
    if (req.body.removePhoto === "true") {
      await removeFile("recipe", id);
    }
    await update(id, data);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteHandler = async (req, res) => {
  try {
    const { id, user } = req.params;
    let recipe = await readByID(id);
    if (user !== recipe.By.id)
      throw { code: 401, error: "You can't tinker with this recipe" };
    await remove(id);
    await removeFile("recipe", id);
    return await res.json({ success: true });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getImage = async (req, res) => {
  try {
    const path = await downloadByID("recipe", req.params.id);
    return await res.sendFile(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getLength = async (req, res) => {
  try {
    const { id } = req.params;
    return res.json(await readByUserID(id));
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

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
