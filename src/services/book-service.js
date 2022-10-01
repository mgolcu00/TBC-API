// BookService
/*


Book :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - google_id : string (unique) (not null)
    - title : string (not null)
    - author : string (not null)
    - description : string (optional)
    - image_url : string (optional)
    - page_count : int (optional)

    Book :
    - createBook : Create
    - getBook : Read
    - getAllBooks : Read
    - updateBook : Update
    - deleteBook : Delete
    - getBookByGoogleId : Read
    - getBookWithQuery : Read

*/

const pool = require('../data/database');

const createBook = (book) => {
    return new Promise(function (resolve, reject) {
        const { google_id, title, author, description, image_url, page_count } = book;
        const text = "INSERT INTO books (google_id,title,author,description,image_url,page_count) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *";
        const values = [google_id, title, author, description, image_url, page_count];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(res.rows[0]);
        });
    }
    );
}

const getBookByGoogleId = (google_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM books WHERE google_id = $1";
        const values = [google_id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.rows[0]);
        });
    }
    );
}

const getBookWithQuery = (query) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM books WHERE title LIKE $1 OR author LIKE $1";
        const values = [query];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.rows);
        });
    }
    );
}

const getAllBooks = () => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM books";
        pool.query(text, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.rows);
        });
    }
    );
}

const getBook = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM books WHERE id = $1";
        const values = [id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.rows[0]);
        });
    }
    );
}

const updateBook = (id, book) => {
    return new Promise(function (resolve, reject) {
        const { google_id, title, author, description, image_url, page_count } = book;
        const text = "UPDATE books SET google_id = $1, title = $2, author = $3, description = $4, image_url = $5, page_count = $6 WHERE id = $7 RETURNING *";
        const values = [google_id, title, author, description, image_url, page_count, id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.rows[0]);
        });
    }
    );
}

const deleteBook = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM books WHERE id = $1";
        const values = [id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.rows[0]);
        });
    }
    );
}

module.exports = {
    createBook,
    getBook,
    getAllBooks,
    updateBook,
    deleteBook,
    getBookByGoogleId,
    getBookWithQuery
}

