// Club Service
/*
Club :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - name : string (not null)
    - admin_id : string (FK) (not null)
    - invitation_code : string (unique) (not null) (generated)
    - header_image_url : string (optional) 
    - description : string (optional)
    - current_book_id : string (optional) (FK)
    - next_book_id : string (optional) (FK)


    Club :
    - createClub : Create
    - getClub : Read
    - getAllClubs : Read
    - updateClub : Update
    - deleteClub : Delete
    - getClubByInvitationCode : Read
    - getClubByAdminId : Read
    - getClubByMemberId : Read

*/

const pool = require('../data/database');

const createClub = (data) => {
    return new Promise(function (resolve, reject) {
        const { name, admin_id, header_image_url, description } = data;
        const text = "INSERT INTO clubs (name,admin_id,header_image_url,description) VALUES ($1,$2,$3,$4) RETURNING *";
        const values = [name, admin_id, header_image_url, description];
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

const getClub = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs WHERE id = $1";
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

const getAllClubs = () => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs";
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

const updateClub = (id, data) => {
    return new Promise(function (resolve, reject) {
        const { name, admin_id, header_image_url, description } = data;
        let text = "UPDATE clubs SET ";
        let values = [];
        if (name) {
            text += "name = $1,";
            values.push(name);
        }
        if (admin_id) {
            text += "admin_id = $2,";
            values.push(admin_id);
        }
        if (header_image_url) {
            text += "header_image_url = $3,";
            values.push(header_image_url);
        }
        if (description) {
            text += "description = $4,";
            values.push(description);
        }
        text = text.slice(0, -1);
        text += " WHERE id = $5 RETURNING *";
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

const deleteClub = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM clubs WHERE id = $1 RETURNING *";
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

const getClubByInvitationCode = (invitation_code) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs WHERE invitation_code = $1";
        const values = [invitation_code];
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

const getClubByAdminId = (admin_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs WHERE admin_id = $1";
        const values = [admin_id];
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

const getClubByMemberId = (member_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM clubs WHERE id IN (SELECT club_id FROM club_members WHERE member_id = $1)";
        const values = [member_id];
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
    createClub,
    getClub,
    getAllClubs,
    updateClub,
    deleteClub,
    getClubByInvitationCode,
    getClubByAdminId,
    getClubByMemberId
}