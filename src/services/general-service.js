// General Service all util requestes have as best practices

const pool = require('../data/database');
const { comparePassword, hashPassword, createInvitationCode } = require("../utils/crypt-util");
const { createMessage, poolExceptionToMessage } = require('../utils/message-util');


// Login 
// login with email and password
// return
/*
{
    auth: {
        accessToken: token,
    },
    user: {
        id: "string",
        username: "username",
        email: "email@email.com",
        avatar_url: "https://img.com"
    },
    club:{
        id: "string",
        name: "string",
        is_admin: "boolean",
    }or
    club:null,
}
*/

const login = (
    { email,
        password, }
) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM users WHERE email = $1";
        const values = [email];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            if (res.rows.length === 0) {
                reject(createMessage("User not found", 404));
                return;
            }
            const user = res.rows[0];
            comparePassword(password, user.password, (err, result) => {
                if (err) {
                    reject(poolExceptionToMessage(err));
                    return;
                }
                if (result) {
                    // get club
                    const text = "SELECT * FROM club_members WHERE user_id = $1";
                    const values = [user.id];
                    pool.query(text, values, (err, res) => {
                        if (err) {
                            reject(poolExceptionToMessage(err));
                            return;
                        }
                        const club = res.rows[0];
                        resolve({
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                avatar_url: user.avatar_url,
                            },
                            club: club ? club : null,
                        });
                    });
                } else {
                    reject(createMessage("Wrong password", 401));
                }
            });
        });
    });
}

// Register
// register with email (required), password (required) and username (required) and avatar_url (optional)
// return
/*
{
    auth: {
        accessToken: token,
    },
    user: {
        id: "string",
        username: "string",
        email: "string",
        avatar_url: "string",
    },
    club:{
        id: "string",
        name: "string",
        is_admin: "boolean",
    }or
    club:null,
}
*/
const register = (
    { email,
        username,
        password,
        avatar_url, }
) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM users WHERE email = $1";
        const values = [email];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            if (res.rows.length > 0) {
                reject(createMessage("Email already exists", 409));
                return;
            }
            hashPassword(password, (err, hash) => {
                if (err) {
                    reject(poolExceptionToMessage(err));
                    return;
                }
                const text = "INSERT INTO users (email, username, password, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *";
                const values = [email, username, hash, avatar_url];
                pool.query(text, values, (err, res) => {
                    if (err) {
                        reject(poolExceptionToMessage(err));
                        return;
                    }
                    const user = res.rows[0];
                    resolve({
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            avatar_url: user.avatar_url,
                        },
                        club: null,
                    });
                });
            });
        });
    });
}


// CREATE CLUB 
// just input club name get user id
// return
/*
{
    club,
    user,
}
*/

const createClub = ({ name, user_id }) => {
    return new Promise(function (resolve, reject) {
        const invitation_code = createInvitationCode(name);
        const text = "INSERT INTO clubs (name,admin_id,invitation_code) VALUES ($1, $2, $3) RETURNING *";
        const values = [name, user_id, invitation_code];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            const club = res.rows[0];
            const text = "INSERT INTO club_members (club_id, user_id) VALUES ($1, $2) RETURNING *";
            const values = [club.id, user_id];
            pool.query(text, values, (err, res) => {
                if (err) {
                    reject(poolExceptionToMessage(err));
                    return;
                }
                const club_member = res.rows[0];
                if (club_member) {
                    club.success = true;
                }
                resolve(club);
            });
        });
    });
}

const joinClub = ({ invitation_code, user_id }) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs WHERE invitation_code = $1";
        const values = [invitation_code];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            if (res.rows.length === 0) {
                reject(createMessage("Club not found", 404));
                return;
            }
            const club = res.rows[0];
            const text = "INSERT INTO club_members (club_id, user_id) VALUES ($1, $2) RETURNING *";
            const values = [club.id, user_id];
            pool.query(text, values, (err, res) => {
                if (err) {
                    reject(poolExceptionToMessage(err));
                    return;
                }
                const club_member = res.rows[0];
                if (club_member) {
                    const text = "SELECT * FROM clubs WHERE id = $1";
                    const values = [club_member.club_id];
                    pool.query(text, values, (err, res) => {
                        if (err) {
                            reject(poolExceptionToMessage(err));
                            return;
                        }
                        const club = res.rows[0];
                        resolve({ club });
                    });
                } else {
                    reject(createMessage("Club not found", 404));
                }
            });
        });
    });
}


const getClub = ({ club_id }) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs WHERE id = $1";
        const values = [club_id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            if (res.rows.length === 0) {
                reject(createMessage("Club not found", 404));
                return;
            }
            const club = res.rows[0];
            // get members 
            const text = "SELECT users.id, users.username, users.email, users.avatar_url, users.role FROM users INNER JOIN club_members ON users.id = club_members.user_id WHERE club_members.club_id = $1";
            const values = [club_id];
            pool.query(text, values, (err, res) => {
                if (err) {
                    reject(poolExceptionToMessage(err));
                    return;
                }
                let members = res.rows;
                members = members.map((member) => {
                    if (member.id === club.admin_id) {
                        member.role = 'admin';
                        return member
                    }
                    return member
                })
                // get books 
                const text = "SELECT books.id,books.title,books.google_id,books.author,books.page_count ,club_next_books.priority FROM books INNER JOIN club_next_books ON books.id = club_next_books.book_id WHERE club_next_books.club_id = $1";
                const values = [club_id];

                pool.query(text, values, (err, res) => {
                    if (err) {
                        reject(poolExceptionToMessage(err));
                        return;
                    }
                    const next_books = res.rows;

                    const text = "SELECT books.id,books.title,books.google_id,books.author,books.page_count ,club_readed_books.readed_date FROM books INNER JOIN club_readed_books ON books.id = club_readed_books.book_id WHERE club_readed_books.club_id = $1";
                    const values = [club_id];
                    pool.query(text, values, (err, res) => {
                        if (err) {
                            reject(poolExceptionToMessage(err));
                            return;
                        }
                        const readed_books = res.rows;
                        const text = "SELECT * FROM meetings WHERE club_id = $1";
                        const values = [club_id];
                        pool.query(text, values, (err, res) => {
                            if (err) {
                                reject(poolExceptionToMessage(err));
                                return;
                            }
                            const meeting = res.rows[0];
                            resolve({ club, members, next_books, readed_books, meeting });
                        }
                        );
                    });
                })
            });
        });
    });
}

const addBookToClub = ({ club_id, book_id }) => {
    return new Promise(function (resolve, reject) {
        const text = "INSERT INTO club_next_books (club_id, book_id) VALUES ($1, $2) RETURNING *";
        const values = [club_id, book_id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            const club_next_book = res.rows[0];
            if (club_next_book) {
                getClub({ club_id }).then((club) => {
                    resolve(club);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(createMessage("Club not found", 404));
            }
        });
    });
}

const removeBookFromClub = ({ club_id, book_id }) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM club_next_books WHERE club_id = $1 AND book_id = $2 RETURNING *";
        const values = [club_id, book_id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            const club_next_book = res.rows[0];
            if (club_next_book) {
                getClub({ club_id }).then((club) => {
                    resolve(club);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(createMessage("Club not found", 404));
            }
        });
    });
}

const setCurrentBook = ({ club_id, book_id }) => {
    return new Promise(function (resolve, reject) {
        const text = "UPDATE clubs SET current_book_id = $1 WHERE id = $2 RETURNING *";
        const values = [book_id, club_id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            const club = res.rows[0];
            if (club) {
                getClub({ club_id }).then((club) => {
                    resolve(club);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(createMessage("Club not found", 404));
            }
        });
    });
}

const readCurrentBook = ({ club_id }) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs WHERE id = $1";
        const values = [club_id];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            const club = res.rows[0];
            if (club) {
                const text = "INSERT INTO club_readed_books (club_id, book_id) VALUES ($1, $2) RETURNING *";
                const values = [club_id, club.current_book_id]
                pool.query(text, values, (err, res) => {
                    if (err) {
                        reject(poolExceptionToMessage(err));
                        return;
                    }
                    const club_readed_book = res.rows[0];
                    if (club_readed_book) {
                        const text = "DELETE FROM club_next_books WHERE club_id = $1 AND book_id = $2 RETURNING *";
                        const values = [club_id, club.current_book_id];
                        pool.query(text, values, (err, res) => {
                            if (err) {
                                reject(poolExceptionToMessage(err));
                                return;
                            }
                            const club_next_books = res.rows;
                            if (club_next_books) {
                                // set current book to null
                                const text = "UPDATE clubs SET current_book_id = null WHERE id = $1 RETURNING *";
                                const values = [club_id];
                                pool.query(text, values, (err, res) => {
                                    if (err) {
                                        reject(poolExceptionToMessage(err));
                                        return;
                                    }
                                    const club = res.rows[0];
                                    if (club) {
                                        getClub({ club_id }).then((club) => {
                                            resolve(club);
                                        }).catch((err) => {
                                            reject(err);
                                        });
                                    } else {
                                        reject(createMessage("Club not found", 404));
                                    }
                                });
                            } else {
                                reject(createMessage("Club not found", 404));
                            }
                        });
                    } else {
                        reject(createMessage("Club not found", 404));
                    }
                });
            } else {
                reject(createMessage("Club not found", 404));
            }
        });
    });
}

const addMeeting = ({ club_id, date_time, title, description, meeting_url }) => {
    return new Promise(function (resolve, reject) {
        let m_date_time = date_time;
        if (!date_time) {
            m_date_time = Date.now();
        }
        const text = "INSERT INTO meetings (club_id, date_time,title,description,meeting_url) VALUES ($1, $2,$3,$4,$5) RETURNING *";
        const values = [club_id, m_date_time, title, description, meeting_url];
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            const meeting = res.rows[0];
            if (meeting) {
                getClub({ club_id }).then((club) => {
                    resolve(club);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(createMessage("Club not found", 404));
            }
        });
    });
}

const updateMeeting = ({ club_id, meeting_id, date_time, title, description, meeting_url }) => {
    return new Promise(function (resolve, reject) {

        let text = "UPDATE meetings SET "
        let values = [];
        let count = 1;
        if (date_time) {
            text += "date_time = $" + count + ",";
            values.push(date_time);
            count++;
        }
        if (title) {
            text += "title = $" + count + ",";
            values.push(title);
            count++;
        }
        if (description) {
            text += "description = $" + count + ",";
            values.push(description);
            count++;
        }
        if (meeting_url) {
            text += "meeting_url = $" + count + ",";
            values.push(meeting_url);
            count++;
        }
        text = text.substring(0, text.length - 1);
        text += " WHERE id = $" + count + " RETURNING *";
        values.push(meeting_id);
        pool.query(text, values, (err, res) => {
            if (err) {
                reject(poolExceptionToMessage(err));
                return;
            }
            const meeting = res.rows[0];
            if (meeting) {
                getClub({ club_id }).then((club) => {
                    resolve(club);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject(createMessage("Club not found", 404));
            }
        });
    });
}













module.exports = {
    login,
    register,
    createClub,
    joinClub,
    getClub,
    addBookToClub,
    removeBookFromClub,
    setCurrentBook,
    readCurrentBook,
    addMeeting,
    updateMeeting
}
