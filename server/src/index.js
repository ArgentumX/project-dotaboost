require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routers/index");
const errorHandler = require("./middleware/error-middleware");
const path = require("path");
const roleService = require("./services/role-service");
const http = require("http");
const { init } = require("./services/socket-service");
const socketService = require("./services/socket-service");
const {
    IpBlacklistMiddleware,
    loadBlacklistData,
} = require("./middleware/ip-blacklist-middleware");
const config = require("./config");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
app.use(IpBlacklistMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(
    fileUpload({
        abortOnLimit: true,
        limits: { fileSize: config.MAX_MB_UPLOAD_FILE_SIZE * 1024 * 1024 },
    })
);
app.use("/api", router);
// Must be the last for errors handling of previous lines
app.use(errorHandler);

const server = http.createServer(app);

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await loadBlacklistData();
        await roleService.initRoles();
        socketService.init(server);
        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
