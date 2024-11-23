const db = require('../config/dbConfig');
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool(db).promise();

class MovieService {
    // Get all movies
    static async getAllMovies() {
        const [movies] = await pool.query('SELECT * FROM movies');
        return movies;
    }

    // Get a movie by ID
    static async getMovieById(id) {
        const [movie] = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
        return movie[0];
    }

    // Add a new movie
    static async addMovie({ title, director, year, genre }) {
        const [result] = await pool.query(
            'INSERT INTO movies (title, director, year, genre) VALUES (?, ?, ?, ?)',
            [title, director, year, genre]
        );
        return result.insertId;
    }

    // Update an existing movie
    static async updateMovie(id, { title, director, year, genre }) {
        await pool.query(
            'UPDATE movies SET title = ?, director = ?, year = ?, genre = ? WHERE id = ?',
            [title, director, year, genre, id]
        );
    }

    // Delete a movie
    static async deleteMovie(id) {
        await pool.query('DELETE FROM movies WHERE id = ?', [id]);
    }
}

module.exports = MovieService;