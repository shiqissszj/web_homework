const db = require('../config/dbConfig');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// 使用连接池
const pool = mysql.createPool(db).promise();

// 登录
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 查询用户信息
        const [users] = await pool.query('SELECT * FROM users WHERE name = ? AND pwd = ?', [username, password]);

        if (users.length === 0) {
            return res.status(401).send({ code: 401, msg: '用户名或密码错误' });
        }

        // 获取用户信息
        const user = users[0];

        // 将用户信息保存到会话中
        req.session.user = {
            id: user.id,
            name: user.name,
            age: user.age,
            gender: user.gender,
            address: user.address,
            imgUrl: user.imgUrl,
        };

        res.send({ code: 200, msg: '登录成功', user: req.session.user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ code: 500, msg: '服务器错误' });
    }
};

// 注册
exports.register = async (req, res) => {
    try {
        const { username, password, age, gender, address, imgUrl } = req.body;

        if (!username || !password) {
            return res.status(400).send({ code: 400, msg: '用户名和密码为必填项' });
        }

        // 插入新用户数据
        await pool.query(
            'INSERT INTO users (name, pwd, age, gender, address, imgUrl) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, age, gender, address, imgUrl || '/images/default-avatar.jpg']
        );

        res.status(201).send({ code: 201, msg: '注册成功' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ code: 500, msg: '服务器错误' });
    }
};

// 获取当前登录用户信息
exports.getSessionUser = (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({
            code: 200,
            username: req.session.user.username,
            role: req.session.user.role,
        });
    } else {
        res.status(401).json({ code: 401, msg: '用户未登录' });
    }
};

// 检查用户是否登录并返回用户信息
exports.checkSession = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ code: 200, ...req.session.user });
    } else {
        res.status(401).json({ code: 401, msg: 'Not logged in' });
    }
};

// 退出登录
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ code: 500, msg: '退出登录失败，请稍后重试！' });
        } else {
            res.status(200).json({ code: 200, msg: '成功退出登录！' });
        }
    });
};