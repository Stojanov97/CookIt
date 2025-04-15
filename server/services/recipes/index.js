const express = require("express"); // Import the Express framework
require("../../pkg/db"); // Initialize the database connection
const config = require("../../pkg/config").get; // Import the configuration utility

// Import all the route handlers for the recipes service
const {
  createHandler,
  readByCategoryHandler,
  readHandler,
  readByIDHandler,
  readByIngredientsHandler,
  updateHandler,
  deleteHandler,
  getImage,
  getLength,
} = require("./handlers");

const cookieParser = require("cookie-parser"); // Middleware to parse cookies
const fileUpload = require("express-fileupload"); // Middleware to handle file uploads
const { expressjwt: jwt } = require("express-jwt"); // Middleware for JWT authentication

const service = express(); // Create an Express application
const port = config("RECIPES_SERVICE_PORT"); // Get the port for the service from the configuration

// Middleware to parse JSON request bodies
service.use(express.json());
// Middleware to handle file uploads
service.use(fileUpload());
// Middleware to parse cookies
service.use(cookieParser());
// Middleware to handle JWT authentication, excluding certain paths
service.use(
  jwt({
    secret: config("JWT_SECRET"), // Secret key for JWT
    algorithms: ["HS256"], // Algorithm used for signing the JWT
    getToken: function (req) {
      return req.cookies.token; // Extract the token from cookies
    },
  }).unless({
    path: [/^\/api\/v1\/recipes\/.*/], // Paths excluded from JWT authentication
  })
);

// Define routes for the recipes service
service.get("/api/v1/recipes", readHandler); // Get all recipes
service.get("/api/v1/recipes/:id", readByIDHandler); // Get a recipe by ID
service.get("/api/v1/recipes/length/:id", getLength); // Get the length of a recipe
service.get("/api/v1/recipes/image/:id", getImage); // Get the image of a recipe
service.get("/api/v1/recipes/category/:category", readByCategoryHandler); // Get recipes by category
service.get("/api/v1/recipes/ingredient/:ing", readByIngredientsHandler); // Get recipes by ingredient
service.post("/api/v1/recipes", createHandler); // Create a new recipe
service.put("/api/v1/recipes/:id/:user", updateHandler); // Update a recipe by ID and user
service.delete("/api/v1/recipes/:id/:user", deleteHandler); // Delete a recipe by ID and user

// Start the service and listen on the specified port
service.listen(port, (err) =>
  err ? console.log(err) : console.log("Recipes service started successfully")
);
