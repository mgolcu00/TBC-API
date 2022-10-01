// User Service
/*

Model : 
User :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - email : string (unique) (not null)
    - username : string (unique) (not null)
    - role : string (optional) (default : user)
    - password : string (not null)
    - avatar_url : string (optional)
    - created_at : timestamp (generated) (not null)
    - updated_at : timestamp (generated) (not null)


User :
    - createUser : Create
    - getUser : Read
    - getAllUsers : Read
    - updateUser : Update
    - deleteUser : Delete
    - getUserByEmailAndPassword : Read
*/


const pool = require('../data/database');
const { comparePassword, hashPassword } = require("../utils/crypt-util");

const createUser = (data) => {
    return new Promise(function (resolve, reject) {
        const { email, username, password } = data;
        hashPassword(password, (err, hash) => {
            if (err) {
                reject(err);
            }
            const text = "INSERT INTO users (email,username,password) VALUES ($1,$2,$3) RETURNING *";
            const values = [email, username, hash];
            pool.query(text, values, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows[0]);
            });
        });
    }
    );
}

const getUserByEmailAndPassword = (data) => {
    return new Promise(function (resolve, reject) {
        const { email, password } = data;
        const text = "SELECT * FROM users WHERE email = $1";
        const values = [email];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
            }
            const user = res.rows[0];
            if (user) {
                comparePassword(password, user.password, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    if (res) {
                        resolve(user);
                    } else {
                        reject("Wrong password");
                    }
                });
            } else {
                reject("User not found");
            }
        });
    }
    );
}
const getUserByUsernameAndPassword = (data) => {
    return new Promise(function (resolve, reject) {
        const { username, password } = data;
        const text = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
            }
            const user = res.rows[0];
            if (user) {
                comparePassword(password, user.password, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    if (res) {
                        resolve(user);
                    } else {
                        reject("Wrong password");
                    }
                });
            } else {
                reject("User not found");
            }
        });
    }
    );
}

const getUser = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM users WHERE id = $1";
        const values = [id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    }
    );
}

const getAllUsers = () => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM users";
        pool.query(text, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows);
        });
    }
    );
}

const updateUser = (id, data) => {
    return new Promise(function (resolve, reject) {
        const { email, username, password, avatar_url } = data;
        const text = "UPDATE users SET email = $1, username = $2, password = $3, avatar_url = $4 WHERE id = $5 RETURNING *";
        const values = [email, username, password, avatar_url, id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    }
    );
}

const deleteUser = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM users WHERE id = $1";
        const values = [id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res.rows[0]);
        });
    }
    );
}
