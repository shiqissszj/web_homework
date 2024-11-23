const db = require('../config/dbConfig');
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool(db).promise();

// Movie model
class Movie {
    static async findAll() {
        const [rows] = await pool.query('SELECT id, filmId, name, description, posterUrl, popularity FROM movie');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT id, filmId, name, description, posterUrl, popularity FROM movie WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ filmId, name, description, posterUrl, popularity }) {
        const [result] = await pool.query(
            'INSERT INTO movie (filmId, name, description, posterUrl, popularity) VALUES (?, ?, ?, ?, ?)',
            [filmId, name, description, posterUrl, popularity]
        );
        return result.insertId;
    }

    static async update(id, { filmId, name, description, posterUrl, popularity }) {
        await pool.query(
            'UPDATE movie SET filmId = ?, name = ?, description = ?, posterUrl = ?, popularity = ? WHERE id = ?',
            [filmId, name, description, posterUrl, popularity, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM movie WHERE id = ?', [id]);
    }
}

module.exports = Movie;