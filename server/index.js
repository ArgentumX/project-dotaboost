require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routers/index");
const errorHandler = require("./middleware/error-middleware");
const path = require("path");
const RoleService = require("./services/role-service.js");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({ abortOnLimit: true }));
app.use("/api", router);
// Must be the last for errors handling of previous lines
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await RoleService.initRoles();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
