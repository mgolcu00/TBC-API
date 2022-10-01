const bookController = require('../controllers/book-controller');
const router = require('express').Router();
const { verifyToken } = require('../middlewares/authorization');

router.post('/add', verifyToken, bookController.addBookFromGoogle);

module.exports = router;