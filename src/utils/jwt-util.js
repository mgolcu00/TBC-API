const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// data is user data
/*
User: {
    id: 1,
    username: "admin",
    email: "admin@admin.com",
}
*/


exports.generateTokenWithoutExpire = (data) => {
    return jsonwebtoken.sign(data, process.env.JWT_SECRET);
};

exports.generateTokenWithRefresh = (data) => {
    const accessToken = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const refreshToken = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
    const expires_in = process.env.JWT_EXPIRES_IN;
    return { accessToken, refreshToken, expires_in };
}
