const express = require("express"); // Import the Express framework for building web applications
require("../../pkg/db"); // Initialize the database connection
const config = require("../../pkg/config").get; // Import the configuration utility to fetch environment variables

// Import handler functions for various authentication-related operations
const {
  registerHandler,
  loginHandler,
  updateCredentialsHandler,
  requestResetPasswordHandler,
  resetPasswordHandler,
  logoutHandler,
  readAllHandler,
  refreshToken,
} = require("./handlers");

const { expressjwt: jwt } = require("express-jwt"); // Import middleware for handling JWT authentication
const cookieParser = require("cookie-parser"); // Middleware to parse cookies in incoming requests

const service = express(); // Create an instance of an Express application
const port = config("USERS_SERVICE_PORT") || 3000; // Define the port for the service, defaulting to 3000 if not set

service.use(cookieParser()); // Use cookie parser middleware to handle cookies
service.use(express.json()); // Use middleware to parse JSON payloads in incoming requests

// Configure JWT middleware for authentication
service.use(
  jwt({
    secret: config("JWT_SECRET"), // Secret key for verifying JWTs
    algorithms: ["HS256"], // Specify the algorithm used for signing JWTs
    getToken: function (req) {
      return req.cookies.token; // Extract the token from cookies
    },
  }).unless({
    // Define routes that do not require JWT authentication
    path: [
      "/api/v1/auth/register", // Public route for user registration
      "/api/v1/auth/login", // Public route for user login
      "/api/v1/auth/refreshToken", // Public route for refreshing tokens
      { url: "/api/v1/auth/", methods: ["GET", "POST", "DELETE"] }, // Public routes for specific methods
      { url: /^\/api\/v1\/auth\/.*/, method: "PATCH" }, // Public PATCH routes matching the pattern
    ],
  })
);

// Define routes and associate them with their respective handlers
service.post("/api/v1/auth/refreshToken", refreshToken); // Route to refresh JWT tokens
service.get("/api/v1/auth", readAllHandler); // Route to read all user data
service.post("/api/v1/auth/register", registerHandler); // Route for user registration
service.post("/api/v1/auth/login", loginHandler); // Route for user login
service.post("/api/v1/auth", requestResetPasswordHandler); // Route to request a password reset
service.patch("/api/v1/auth/:id", resetPasswordHandler); // Route to reset a user's password
service.put("/api/v1/auth", updateCredentialsHandler); // Route to update user credentials
service.delete("/api/v1/auth", logoutHandler); // Route to log out a user

// Start the service and listen on the specified port
service.listen(port, (err) =>
  err ? console.log(err) : console.log("Auth service started successfully")
);
