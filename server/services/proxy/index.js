const path = require("path");
const proxy = require("express-http-proxy");
const express = require("express");
const config = require("../../pkg/config").get;
const app = express();

const allowCrossDomain = (req, res, next) => {
  // CORS middleware
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,PATCH,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  res.header(`Access-Control-Allow-Credentials`, true);
  next();
};

app.use(allowCrossDomain);
// Proxy all requests to the services
app.use(
  "/api/v1/auth",
  proxy(`http://127.0.0.1:${config("USERS_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("USERS_SERVICE_PORT")}/api/v1/auth${req.url}`,
  })
);

app.use(
  "/api/v1/recipes",
  proxy(`http://127.0.0.1:${config("RECIPES_SERVICE_PORT")}`, {
    proxyReqPathResolver: (req) =>
      `http://127.0.0.1:${config("RECIPES_SERVICE_PORT")}/api/v1/recipes${
        req.url
      }`,
    limit: "35mb",
  })
);

// Serve the web app
const PORT = config("APP_PORT") || 3000;

app.listen(PORT, (err) =>
  err ? console.log(err) : console.log("Proxy started successfully")
);
