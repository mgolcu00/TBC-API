// Clubs Books Service

/*


ClubNextBooks :
    - club_id : string (FK) (not null)
    - book_id : string (FK) (not null)
    - priority : int (not null) (default : 0)

ClubReadedBooks :
    - club_id : string (FK) (not null)
    - book_id : string (FK) (not null)
    - readed_date : long (not null) (unix timestamp)


ClubNextBooks :
    - createClubNextBook : Create
    - getClubNextBook : Read
    - getAllClubNextBooks : Read
    - updateClubNextBook : Update
    - deleteClubNextBook : Delete
    - getClubNextBookByClubId : Read
    - getClubNextBookByBookId : Read

ClubReadedBooks :
    - createClubReadedBook : Create
    - getClubReadedBook : Read
    - getAllClubReadedBooks : Read
    - updateClubReadedBook : Update
    - deleteClubReadedBook : Delete
    - getClubReadedBookByClubId : Read
    - getClubReadedBookByBookId : Read
    - getClubReadedBookByClubIdAndBookId : Read


*/

const pool = require('../data/database');

const createClubNextBook = (data) => {
    return new Promise(function (resolve, reject) {
        const { club_id, book_id, priority } = data;
        const text = "INSERT INTO club_next_books (club_id,book_id,priority) VALUES ($1,$2,$3) RETURNING *";
        const values = [club_id, book_id, priority];
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

const getClubNextBook = (club_id, book_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM club_next_books WHERE club_id = $1 AND book_id = $2";
        const values = [club_id, book_id];
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

const getClubNextBooks = (club_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM club_next_books WHERE club_id = $1";
        const values = [club_id];
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

const deleteClubNextBook = (club_id, book_id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM club_next_books WHERE club_id = $1 AND book_id = $2";
        const values = [club_id, book_id];
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

const createClubReadedBook = (data) => {
    return new Promise(function (resolve, reject) {
        const { club_id, book_id, readed_date } = data;
        const text = "INSERT INTO club_readed_books (club_id,book_id,readed_date) VALUES ($1,$2,$3) RETURNING *";
        const values = [club_id, book_id, readed_date];
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

const getClubReadedBook = (club_id, book_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM club_readed_books WHERE club_id = $1 AND book_id = $2";
        const values = [club_id, book_id];
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

const getClubReadedBooks = (club_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM club_readed_books WHERE club_id = $1";
        const values = [club_id];
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

const deleteClubReadedBook = (club_id, book_id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM club_readed_books WHERE club_id = $1 AND book_id = $2";
        const values = [club_id, book_id];
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

// get club all books
const getClubReadedBooksAndNextBooks = (club_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM club_readed_books WHERE club_id = $1 UNION SELECT * FROM club_next_books WHERE club_id = $1";
        const values = [club_id];
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




module.exports = {
    createClubNextBook,
    getClubNextBook,
    getClubNextBooks,
    deleteClubNextBook,
    createClubReadedBook,
    getClubReadedBook,
    getClubReadedBooks,
    deleteClubReadedBook,
    getClubReadedBooksAndNextBooks
}
