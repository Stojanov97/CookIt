const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
const {
  createHandler,
  readByCategoryHandler,
  readHandler,
  readByIngredientsHandler,
  updateHandler,
  deleteHandler,
  getImage,
  getLength,
} = require("./handlers");

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { expressjwt: jwt } = require("express-jwt");
const service = express();
const port = config("RECIPES_SERVICE_PORT");

service.use(express.json());
service.use(fileUpload());
service.use(cookieParser());
service.use(
  jwt({
    secret: config("JWT_SECRET"),
    algorithms: ["HS256"],
    getToken: function (req) {
      return req.cookies.token;
    },
  }).unless({
    path: [
      "/api/v1/recipes/recent",
      "/api/v1/recipes/length",
      /^\/api\/v1\/recipes\/category\/.*/,
      /^\/api\/v1\/recipes\/image\/.*/,
      { url: "/api/v1/recipes/", method: "GET" },
    ],
  })
);

service.get("/api/v1/recipes", readHandler);
service.get("/api/v1/recipes/length", getLength);
service.get("/api/v1/recipes/image/:id", getImage);
service.get("/api/v1/recipes/category/:category", readByCategoryHandler);
service.get("/api/v1/recipes/ingredient/:ing", readByIngredientsHandler);
service.post("/api/v1/recipes", createHandler);
service.patch("/api/v1/recipes/:id", updateHandler);
service.delete("/api/v1/recipes/:id", deleteHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Recipes service started successfully")
);
