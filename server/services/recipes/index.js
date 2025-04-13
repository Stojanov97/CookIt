const express = require("express");
require("../../pkg/db");
const config = require("../../pkg/config").get;
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
    path: [/^\/api\/v1\/recipes\/.*/],
  })
);

service.get("/api/v1/recipes", readHandler);
service.get("/api/v1/recipes/:id", readByIDHandler);
service.get("/api/v1/recipes/length/:id", getLength);
service.get("/api/v1/recipes/image/:id", getImage);
service.get("/api/v1/recipes/category/:category", readByCategoryHandler);
service.get("/api/v1/recipes/ingredient/:ing", readByIngredientsHandler);
service.post("/api/v1/recipes", createHandler);
service.patch("/api/v1/recipes/:id/:user", updateHandler);
service.delete("/api/v1/recipes/:id/:user", deleteHandler);

service.listen(port, (err) =>
  err ? console.log(err) : console.log("Recipes service started successfully")
);
