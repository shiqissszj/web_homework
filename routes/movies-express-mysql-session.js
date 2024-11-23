const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController-express-mysql-session');

function isAdmin(req, res, next) {
    console.log('isAdmin middleware: req.user =', req.user); // 调试用

    // 判断当前用户是否为 admin
    if (req.user && req.user.name === 'admin') {
        next();
    } else {
        res.status(403).send({ error: 'Access denied' });
    }
}

// Routes
router.get('/', movieController.getAllMovies); // Public route for all users

// 添加电影
router.post('/add', movieController.addMovie);
// 更新电影
router.put('/update/:id', movieController.updateMovie);
// 删除电影
router.delete('/delete/:id', movieController.deleteMovie);
// 新增渲染编辑页面的路由
router.get('/edit/:id', movieController.renderEditPage);
router.post('/update/:id', movieController.updateMovie);

module.exports = router;