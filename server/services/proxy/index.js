const path = require("path"); // Module to work with file and directory paths
const proxy = require("express-http-proxy"); // Middleware for creating HTTP proxies
const express = require("express"); // Express framework for building web applications
const config = require("../../pkg/config").get; // Configuration utility to fetch environment-specific settings
const app = express(); // Create an Express application instance

// Middleware to allow Cross-Origin Resource Sharing (CORS)
const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`); // Allow requests from any origin
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,PATCH,POST,DELETE`); // Allow specific HTTP methods
  res.header(`Access-Control-Allow-Headers`, `Content-Type`); // Allow specific headers
  res.header(`Access-Control-Allow-Credentials`, true); // Allow credentials (cookies, authorization headers, etc.)
  next(); // Pass control to the next middleware
};

app.use(allowCrossDomain); // Apply the CORS middleware to all incoming requests

// Proxy requests to the authentication service
app.use(
  "/api/v1/auth",
  proxy(`http://127.0.0.1:${config("USERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("USERS_SERVICE_PORT")}/api/v1/auth${req.url}`, // Resolve the target URL for the proxy
  })
);

// Proxy requests to the recipes service
app.use(
  "/api/v1/recipes",
  proxy(`http://127.0.0.1:${config("RECIPES_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("RECIPES_SERVICE_PORT")}/api/v1/recipes${
        req.url
      }`, // Resolve the target URL for the proxy
    limit: "35mb", // Set the request body size limit
  })
);

// Define the port for the proxy server
const PORT = config("APP_PORT") || 3000;

// Start the proxy server and log the status
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log("Proxy started successfully")
);
