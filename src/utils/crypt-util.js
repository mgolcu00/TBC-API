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

exports.createInvitationCode = (name) => {
    let invitationName = name.split(' ').join('').split('').sort(() => 0.5 - Math.random()).join('').substring(0, 4);
    invitationName=invitationName.toUpperCase().trim();
    let invitationNumber = Math.floor(1000 + Math.random() * 9000);
    const invitationCode= invitationName + invitationNumber;
    
    if (invitationCode.length != 8) {
        return this.createInvitationCode(name);
    }
    return invitationCode;
}