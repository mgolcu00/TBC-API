// Meeting Service
/*

Meeting : 
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - club_id : string (FK) (not null)
    - date_time : long (not null) (unix timestamp)
    - title : string (not null)
    - description : string (optional)
    - isActive : boolean (default : false) (not null) 
    - meeting_url : string (optional)


    Meeting :
    - createMeeting : Create
    - getMeeting : Read
    - getAllMeetings : Read
    - updateMeeting : Update
    - deleteMeeting : Delete
    - getMeetingByClubId : Read
*/

const pool = require('../data/database');

const createMeeting = (data) => {
    return new Promise(function (resolve, reject) {
        const { club_id, date_time, title, description } = data;
        const text = "INSERT INTO meetings (club_id,date_time,title,description) VALUES ($1,$2,$3,$4) RETURNING *";
        const values = [club_id, date_time, title, description];
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

const getMeeting = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM meetings WHERE id = $1";
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

const getAllMeetings = () => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM meetings";
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

const updateMeeting = (id, data) => {
    return new Promise(function (resolve, reject) {
        const { club_id, date_time, title, description, meeting_url, is_active } = data;
        let text = "UPDATE meetings SET ";
        let values = [];
        let count = 1;
        if (club_id) {
            text += "club_id = $" + count + ",";
            values.push(club_id);
            count++;
        }
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
        if (is_active) {
            text += "is_active = $" + count + ",";
            values.push(is_active);
            count++;
        }
        text = text.substring(0, text.length - 1);
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

const deleteMeeting = (id) => {
    return new Promise(function (resolve, reject) {
        const text = "DELETE FROM meetings WHERE id = $1";
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

const getMeetingByClubId = (club_id) => {
    return new Promise(function (resolve, reject) {
        const text = "SELECT * FROM meetings WHERE club_id = $1";
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
    createMeeting,
    getMeeting,
    getAllMeetings,
    updateMeeting,
    deleteMeeting,
    getMeetingByClubId
}
