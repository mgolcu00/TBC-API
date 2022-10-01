const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.hashPassword = (password,cb) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        cb(err,hash);
    });
}

exports.comparePassword = (password,hash,cb) => {
    bcrypt.compare(password, hash, function(err, res) {
        cb(err,res);
    });
}
