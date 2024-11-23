const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session); // express-mysql-session
const mainRouter = require("./routes"); // 引入主路由
const dbConfig = require("./config/dbConfig"); // 数据库配置
const movieRoutes = require("./routes/movies-express-mysql-session");
const userRoutes = require("./routes/users-express-mysql-session");

const app = express(); // 创建 Express 应用实例

// 配置模板引擎和模板文件路径
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// 配置静态文件夹
app.use(express.static(path.join(__dirname, "public")));

// 解析请求体数据（支持 JSON 和 URL 编码）
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 配置 session 中间件
const sessionStore = new MySQLStore(dbConfig); // 使用 MySQL 存储 session
app.use(
    session({
        secret: "heiheihei", // 用于加密 session 的 secret
        resave: true, // 是否每次请求都强制保存 session
        saveUninitialized: true, // 是否保存未初始化的 session
        store: sessionStore, // 使用 MySQL 存储 session
    })
);

// 使用主路由
app.use("/", mainRouter);

// 配置子路由
app.use("/movies", movieRoutes); // 挂载电影相关路由
app.use("/users", userRoutes); // 挂载用户管理相关路由

// 全局错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        code: 500,
        msg: "服务器发生错误",
    });
});

// 启动服务器
app.listen(3000, () => {
    console.log("服务器已经启动！   http://localhost:3000");
});