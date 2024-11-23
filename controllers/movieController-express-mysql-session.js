const db = require('../config/dbConfig');
const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool(db).promise();

// 获取所有电影
exports.getAllMovies = async (req, res) => {
    try {
        const [movies] = await pool.query('SELECT id, filmId, name, description, posterUrl, popularity FROM movie');
        res.status(200).json(movies);
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ code: 500, msg: '服务器发生错误' });
    }
};

// 渲染编辑页面
exports.renderEditPage = async (req, res) => {
    try {
        const { id } = req.params;

        // 从数据库中获取电影详情
        const [movie] = await pool.query('SELECT * FROM movie WHERE id = ?', [id]);

        if (movie.length === 0) {
            return res.status(404).send('找不到指定的电影');
        }

        // 渲染编辑页面，并传递电影数据
        res.render('movies04', { movie: movie[0] });
    } catch (error) {
        console.error('Error rendering edit page:', error);
        res.status(500).send('服务器发生错误');
    }
};

// 添加电影
exports.addMovie = async (req, res) => {
    try {
        const { filmId, name, description, posterUrl, popularity } = req.body;

        if (!filmId || !name) {
            return res.status(400).json({ code: 400, msg: '电影编号和名称为必填！' });
        }

        const poster = posterUrl || '/images/movies/default.jpg'; // 使用默认图片路径

        await pool.query(
            'INSERT INTO movie (filmId, name, description, posterUrl, popularity) VALUES (?, ?, ?, ?, ?)',
            [filmId, name, description, poster, popularity]
        );

        res.status(201).json({ code: 201, msg: '电影添加成功！' });
    } catch (err) {
        console.error('Error adding movie:', err);
        res.status(500).json({ code: 500, msg: '服务器发生错误' });
    }
};

// 删除电影
exports.deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        // 删除数据库中的指定电影
        await pool.query('DELETE FROM movie WHERE id = ?', [id]);

        res.status(200).json({ code: 200, msg: '电影删除成功！' });
    } catch (err) {
        console.error('Error deleting movie:', err);
        res.status(500).json({ code: 500, msg: '服务器发生错误' });
    }
};

// 更新电影
exports.updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { filmId, name, description, posterUrl, popularity } = req.body;

        if (!filmId || !name) {
            return res.status(400).json({ code: 400, msg: '电影编号和名称为必填！' });
        }

        const poster = posterUrl || '/images/movies/default.jpg'; // 使用默认图片路径

        // 更新数据库中的电影信息
        await pool.query(
            'UPDATE movie SET filmId = ?, name = ?, description = ?, posterUrl = ?, popularity = ? WHERE id = ?',
            [filmId, name, description, poster, popularity, id]
        );

        // 更新成功后跳转到电影中心页面
        res.redirect('/moviesCenter.html');
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ code: 500, msg: '服务器发生错误' });
    }
};