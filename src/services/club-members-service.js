// Club Members Service 
/*
ClubMembers : 
    - club_id : string (FK) (not null)
    - user_id : string (FK) (not null)

    ClubMembers :
    - createClubMember : Create
    - getClubMember : Read
    - getAllClubMembers : Read
    - updateClubMember : Update
    - deleteClubMember : Delete
    - getClubMemberByClubId : Read
    - getClubMemberByUserId : Read
*/

const pool = require('../data/database');

const createClubMember = (data) => {
    return new Promise(function (resolve, reject) {
        const { club_id, user_id } = data;
        const text = "INSERT INTO club_members (club_id,user_id) VALUES ($1,$2) RETURNING *";
        const values = [club_id, user_id];
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

const getClubMembers = (club_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM club_members WHERE club_id = $1";
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

const deleteClubMember = (club_id, user_id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM club_members WHERE club_id = $1 AND user_id = $2";
        const values = [club_id, user_id];
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
    createClubMember,
    getClubMembers,
    deleteClubMember
}

