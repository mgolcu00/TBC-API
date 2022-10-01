
const emailValidation = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
const passwordValidation = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}
const usernameValidation = (username) => {
    const re = /^[a-zA-Z0-9]+$/;
    return re.test(username);
}
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (email) {
        if (emailValidation(email)) {
            next();
        } else {
            res.status(400).send({ message: "Invalid email" });
        }
    }
    else {
        next()
    }
}
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    if (passwordValidation(password)) {
        next();
    } else {
        res.status(400).send({ message: "Invalid password" });
    }
}
const validateUsername = (req, res, next) => {
    const { username } = req.body;
    if (usernameValidation(username)) {
        next();
    } else {
        res.status(400).send({ message: "Invalid username" });
    }
}

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername
}

