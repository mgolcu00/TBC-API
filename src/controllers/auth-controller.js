const userService = require('../services/user-service');
const { generateTokenWithoutExpire } = require('../utils/jwt-util');

exports.login = (req, res) => {
    const { email, password, username } = req.body;
    if (username) {
        userService.getUserByUsernameAndPassword({ username, password })
            .then(user => {
                const token = generateTokenWithoutExpire(user);
                res.status(200).send({
                    auth: {
                        accessToken: token,
                    },
                    user: user
                });
            }
            )
            .catch(err => {
                res.status(500).send({ message: err });
            }
            );
    } else {
        userService.getUserByEmailAndPassword({ email, password })
            .then(user => {
                const token = generateTokenWithoutExpire({ id: user.id });
                res.status(200).send({
                    auth: {
                        accessToken: token,
                    },
                    user: user
                });
            })
            .catch(err => {
                res.status(500).send({ auth: false, message: err });
            });
    }
}
exports.register = (req, res) => {
    const { email, username, password } = req.body;
    userService.createUser({ email, username, password })
        .then(user => {
            const token = generateTokenWithoutExpire({ id: user.id });
            res.status(200).send(
                {
                    auth: {
                        accessToken: token,
                    },
                    user: user
                }
            );
        })
        .catch(err => {
            res.status(500).send({ auth: false, message: err });
        });
}