const authController = require('../controllers/auth-controller');
const router = require('express').Router();
const {validateEmail,validateUsername} = require('../utils/validation-util');


router.post('/login', validateEmail,validateUsername,authController.login);
router.post('/register',validateEmail,validateUsername, authController.register);

module.exports = router;
