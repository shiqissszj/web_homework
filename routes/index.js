const express = require('express');
const path = require('path');
const router = express.Router();

// 导入子路由模块
const movieRoutes = require('./movies-express-mysql-session');
const authRoutes = require('./auth');

// 设置视图引擎和视图目录
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 确保视图目录路径正确

// 根路由
router.get('/', (req, res) => {
    res.send('欢迎使用电影管理系统！'); // 显示系统欢迎信息
});

// 挂载电影管理模块的路由
router.use('/movies', movieRoutes);

// 挂载认证模块的路由
router.use('/auth', authRoutes);

// 示例：用户管理页面路由（具体逻辑需完善）
router.get('/users/admin', (req, res) => {
    res.send('用户管理页面开发中...'); // 可以替换为实际用户管理页面的逻辑
});

module.exports = router;