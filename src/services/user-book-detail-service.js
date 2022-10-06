// User Book Detail Service
/*

UserBookDetail :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - user_id : string (FK) (not null)
    - book_id : string (FK) (not null)
    - is_read : boolean (not null) (default false)
    - is_favorite : boolean (not null) (default false)
    - is_wish : boolean (not null) (default false)
// user click a book, then add favorite or wish or read
// then if user_id and book_id is exist in UserBookDetail, then update is_read, is_favorite, is_wish
// else insert new row
// if user click a book, then remove favorite or wish or read
// then if user_id and book_id is exist in UserBookDetail, then update is_read, is_favorite, is_wish
// else send error
// get user favorited books from UserBookDetail with UserBookDetail.is_favorite = true


UserBookDetail :
    - createUserBookDetail : Create
    - getUserBookDetail : Read
    - getAllUserBookDetails : Read
    - updateUserBookDetail : Update
    - deleteUserBookDetail : Delete
    - getUserBookDetailByUserIdAndBookId : Read
    - getUserBookDetailByUserId : Read
    - getUserBookDetailByBookId : Read
    - countUserBookDetailByBookIdIsFavorited : Read
    - getBookDetailsByUserId : Read

*/

const pool = require('../data/database');

const createUserBookDetail = (data) => {
    return new Promise(function (resolve, reject) {
        const { user_id, book_id, is_read, is_favorite, is_wish } = data;
        const text = "INSERT INTO user_book_details (user_id,book_id,is_read,is_favorite,is_wish) VALUES ($1,$2,$3,$4,$5) RETURNING *";
        const values = [user_id, book_id, is_read, is_favorite, is_wish];
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
const getUserBookDetail = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM user_book_details WHERE id = $1";
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

const getAllUserBookDetails = () => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM user_book_details";
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

const updateUserBookDetail = (id, data) => {
    return new Promise(function (resolve, reject) {
        const { user_id, book_id, is_read, is_favorite, is_wish } = data;
        let text = "UPDATE user_book_details SET ";
        let values = [];
        let count = 1;
        if (user_id) {
            text += "user_id = $" + count + ", ";
            values.push(user_id);
            count++;
        }
        if (book_id) {
            text += "book_id = $" + count + ", ";
            values.push(book_id);
            count++;
        }
        if (is_read) {
            text += "is_read = $" + count + ", ";
            values.push(is_read);
            count++;
        }
        if (is_favorite) {
            text += "is_favorite = $" + count + ", ";
            values.push(is_favorite);
            count++;
        }
        if (is_wish) {
            text += "is_wish = $" + count + ", ";
            values.push(is_wish);
            count++;
        }
        text = text.substring(0, text.length - 2);
        text += " WHERE id = $" + count;
        values.push(id);

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

const deleteUserBookDetail = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM user_book_details WHERE id = $1";
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

const getUserBookDetailByUserIdAndBookId = (user_id, book_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM user_book_details WHERE user_id = $1 AND book_id = $2";
        const values = [user_id, book_id];
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

const getUserBookDetailByUserId = (user_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM user_book_details WHERE user_id = $1";
        const values = [user_id];
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

const getUserBookDetailByBookId = (book_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM user_book_details WHERE book_id = $1";
        const values = [book_id];
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

const countUserBookDetailByBookIdIsFavorited = (book_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT COUNT(*) FROM user_book_details WHERE book_id = $1 AND is_favorite = true";
        const values = [book_id];
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

const getBookDetailsByUserId = (user_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM user_book_details WHERE user_id = $1";
        const values = [user_id];
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
    createUserBookDetail,
    getUserBookDetail,
    getAllUserBookDetails,
    updateUserBookDetail,
    deleteUserBookDetail,
    getUserBookDetailByUserIdAndBookId,
    getUserBookDetailByUserId,
    getUserBookDetailByBookId,
    countUserBookDetailByBookIdIsFavorited,
    getBookDetailsByUserId
}
