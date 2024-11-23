const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../config/dbConfig');

// 创建数据库连接池
const pool = mysql.createPool(dbConfig).promise();

// 路由：用户管理页面
router.get('/manage', async (req, res, next) => {
    console.log('Fetching users from database...');
    const [users] = await pool.query('SELECT * FROM users'); // 查询所有用户
    res.render('userManagement', {users}); // 渲染页面
});

module.exports = router;