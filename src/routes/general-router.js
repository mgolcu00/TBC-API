const router = require('express').Router();
const generalController = require('../controllers/general-controller');
const { verifyToken } = require('../middlewares/authorization');

router.post('/login', generalController.login);
router.post('/register', generalController.register);

// Club
router.post('/club/create', verifyToken, generalController.createClub);
router.post('/club/join', verifyToken, generalController.joinClub);
router.get('/club/:club_id', verifyToken, generalController.getClub);
router.post('/club/add-book', verifyToken, generalController.addBookToClub);
router.delete('/club/remove-book', verifyToken, generalController.removeBookFromClub);
router.put('/club/set-current-book', verifyToken, generalController.setCurrentBook);
router.post('/club/read-current-book', verifyToken, generalController.readCurrentBook);
router.post('/club/add-meeting', verifyToken, generalController.addMeeting);
router.put('/club/update-meeting', verifyToken, generalController.updateMeeting);

module.exports = router;