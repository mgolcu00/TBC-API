const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const HEADER_KEY = "authorization";
exports.verifyToken = (req, res, next) => {
    let token = req.headers[HEADER_KEY];
    token = token.split(' ')[1];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jsonwebtoken.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.user_id = decoded.user.id;
        next();
    });
}
