const {Pool} = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;



/* Query Creators
const createInsertQuery = (data) => {
    const { tableName, fileds } = data
    let text = "INSERT TABLE " + tableName + " (";
    let values = "VALUES (";
    let i = 0;
    for (; i < fileds.length; i++) {
        if (i > 0) {
            text += ", ";
            values += ", ";
        }
        text += fileds[i];
        values += "$" + (i + 1);
    }
    text += ") " + values + ")";
    // returning
    text += " RETURNING *";
    return text;

}
const createSelectQuery = (data) => {
    const { tableName, fileds } = data
    let text = "SELECT ";
    if(fileds==null){
        text += "*";
        text += " FROM " + tableName;
        return text;
    }
    let i = 0;
    for (; i < fileds.length; i++) {
        if (i > 0) {
            text += ", ";
        }
        text += fileds[i];
    }
    text += " FROM " + tableName;

    return text;
}
*/