const db = require('../config/dbConfig');
const mysql = require('mysql2');

// 创建连接池
const dbPool = mysql.createPool(db).promise();

// 获取所有用户数据
exports.fetchUsers = async () => {
    try {
        const [userList] = await dbPool.query('SELECT id, username, role FROM users');
        return userList; // 返回查询结果
    } catch (error) {
        console.error('Error while fetching user data:', error);
        throw new Error('无法获取用户数据');
    }
};

// 渲染用户管理页面
exports.renderUserManagement = async (req, res) => {
    try {
        // 从数据库中获取用户数据
        const users = await this.fetchUsers();

        // 渲染用户管理页面，并传递用户数据
        res.render('userManagement', { users });
    } catch (error) {
        console.error('Error rendering user management page:', error);
        res.status(500).json({ code: 500, msg: '加载用户管理页面失败', error: error.message });
    }
};

// 新增用户
exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // 检查用户名是否已存在
        const [existingUser] = await dbPool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ code: 400, msg: '用户名已存在' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        await dbPool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, encryptedPassword, role]);

        res.status(201).json({ code: 201, msg: '用户已成功添加' });
    } catch (error) {
        console.error('Error while adding a user:', error);
        res.status(500).json({ code: 500, msg: '服务器内部错误', error: error.message });
    }
};

// 更新用户数据
exports.modifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;

        await dbPool.query('UPDATE users SET username = ?, role = ? WHERE id = ?', [username, role, id]);
        res.status(200).json({ code: 200, msg: '用户信息已更新' });
    } catch (error) {
        console.error('Error while updating user:', error);
        res.status(500).json({ code: 500, msg: '更新用户信息失败', error: error.message });
    }
};

// 删除用户数据
exports.removeUser = async (req, res) => {
    try {
        const { id } = req.params;

        await dbPool.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ code: 200, msg: '用户已成功删除' });
    } catch (error) {
        console.error('Error while deleting user:', error);
        res.status(500).json({ code: 500, msg: '删除用户失败', error: error.message });
    }
};