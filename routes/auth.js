const express = require('express');
const path = require('path');
const router = express.Router();
const authHandler = require('../controllers/authController');
const userHandler = require('../controllers/userController');

// 用户登录接口
router.post('/login', authHandler.login);

// 检查用户会话状态接口
router.get('/check-session', authHandler.checkSession);

// 提供注册页面
router.get('/register.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/userRegister.html'));
});

// 用户注册接口
router.post('/register', authHandler.register);

// 返回当前登录用户信息
router.get('/current-user', (req, res) => {
    if (req.session?.user) {
        return res.json({
            code: 200,
            user: req.session.user,
        });
    }
    res.status(401).json({ code: 401, msg: '用户未登录' });
});

// 用户登出接口
router.post('/logout', authHandler.logout);

// 用户管理页面接口
router.get('/user-management', async (req, res) => {
    if (!req.session?.user) {
        // 未登录用户
        return res.status(401).json({ code: 401, msg: '用户未登录' });
    }

    if (req.session.user.role !== 'admin') {
        // 非管理员用户
        return res.status(403).json({ code: 403, msg: '非管理员用户无权限' });
    }

    try {
        // 从控制器中获取所有用户
        const userList = await userHandler.fetchUsers(); // 确保 userHandler.fetchUsers 返回用户数据
        res.render('userManagement', { users: userList }); // 渲染页面，传递用户数据
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ code: 500, msg: '服务器内部错误' });
    }
});

module.exports = router;