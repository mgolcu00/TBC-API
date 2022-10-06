const generalService = require('../services/general-service');
const jwtUtil = require('../utils/jwt-util');
exports.login = (req, res) => {
    generalService.login(req.body)
        .then(user => {
            const token = jwtUtil.generateTokenWithoutExpire(user);
            user.auth = {
                accessToken: token,
            }
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(400).json(err)
        });
}

exports.register = (req, res) => {
    generalService.register(req.body)
        .then(user => {
            const token = jwtUtil.generateTokenWithoutExpire(user);
            user.auth = {
                accessToken: token,
            }
            res.status(200).json(user)
        })
        .catch(err => { res.status(400).json(err) });
}

exports.createClub = (req, res) => {
    const { name } = req.body;
    const user_id = req.user_id
    generalService.createClub({ name, user_id })
        .then(club => { res.status(200).json(club) })
        .catch(err => { res.status(400).json(err) });
}
exports.joinClub = (req, res) => {
    const { invitation_code } = req.body;
    const user_id = req.user_id
    generalService.joinClub({ invitation_code, user_id })
        .then(club => { res.status(200).json(club) })
        .catch(err => { res.status(400).json(err) });
}
exports.getClub = (req, res) => {
    const { club_id } = req.params;
    const user_id = req.user_id
    generalService.getClub({ club_id })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json(err)
        });
}

exports.addBookToClub = (req, res) => {
    const { club_id, book_id } = req.body;
    const user_id = req.user_id
    generalService.addBookToClub({ club_id, book_id })
        .then(data => { res.status(200).json(data) })
        .catch(err => { res.status(400).json(err) });
}

exports.removeBookFromClub = (req, res) => {
    const { club_id, book_id } = req.body;
    const user_id = req.user_id
    generalService.removeBookFromClub({ club_id, book_id })
        .then(data => { res.status(200).json(data) })
        .catch(err => { res.status(400).json(err) });
}

exports.setCurrentBook = (req, res) => {
    const { club_id, book_id } = req.body;
    const user_id = req.user_id
    generalService.setCurrentBook({ club_id, book_id })
        .then(data => { res.status(200).json(data) })
        .catch(err => { res.status(400).json(err) });
}

exports.readCurrentBook = (req, res) => {
    const { club_id } = req.body;
    const user_id = req.user_id
    generalService.readCurrentBook({ club_id })
        .then(data => { res.status(200).json(data) })
        .catch(err => { res.status(400).json(err) });
}

exports.addMeeting = (req, res) => {
    const { club_id, date_time, title, description, meeting_url } = req.body;
    const user_id = req.user_id
    generalService.addMeeting({ club_id, date_time, title, description, meeting_url })
        .then(data => { res.status(200).json(data) })
        .catch(err => { res.status(400).json(err) });
}

exports.updateMeeting = (req, res) => {
    const { club_id, meeting_id, date_time, title, description, meeting_url } = req.body;
    const user_id = req.user_id
    generalService.updateMeeting({ club_id, meeting_id, date_time, title, description, meeting_url })
        .then(data => { res.status(200).json(data) })
        .catch(err => { res.status(400).json(err) });
}
