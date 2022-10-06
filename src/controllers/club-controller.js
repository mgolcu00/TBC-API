/*
Club Controller


Club :
    - getClub : GET /api/club/:club_id (need auth) (validate is member of club)
        - club_id : string (not null)
        - return : {club}
    - createClub : POST /api/club (need auth)
        - name : string (not null)
        - description : string (optional)
        - header_image_url : string (optional)
        - return : {club}
    - joinClub : POST /api/club/join (need auth)
        - invitation_code : string (not null)
        - return : {club}
    - updateClub : POST /api/club/:club_id (need auth) (validate is admin of club)
        - club_id : string (not null)
        - name : string (optional)
        - description : string (optional)
        - header_image_url : string (optional)
        - return : {club}
    - deleteClub : DELETE /api/club/:club_id (need auth) (validate is admin of club)
        - club_id : string (not null)
        - return : {message}
    
    - getClubMembers : GET /api/club/:club_id/members (need auth) (validate is member of club)
        - club_id : string (not null)
        - return : {members}
    - addClubMember : POST /api/club/:club_id/members (need auth) (validate is admin of club)
        - club_id : string (not null)
        - user_id : string (not null)
        - return : {members}
    - removeClubMember : DELETE /api/club/:club_id/members (need auth) (validate is admin of club)
        - club_id : string (not null)
        - user_id : string (not null)
        - return : {members}
    
    - getClubBooks : GET /api/club/:club_id/books (need auth) (validate is member of club)
        - club_id : string (not null)
        - return : {books} (get ReadedBooks and NextBooks)
    - addClubBook : POST /api/club/:club_id/books (need auth) (validate is admin of club) (default add to NextBooks)
        - club_id : string (not null)
        - book_id : string (not null)
        - priority : int (optional) (default : 0)
        - return : {books}
    - removeClubBook : DELETE /api/club/:club_id/books (need auth) (validate is admin of club)
        - club_id : string (not null)
        - book_id : string (not null)
        - return : {books}

    - setBookReaded : POST /api/club/:club_id/readedbook 
        (need auth) 
        (validate is admin of club) 
        (is book removed from NextBooks and added to ReadedBooks)
        (if book is not in NextBooks, then add to ReadedBooks)
        (if book is current book, then remove current book)
        (set current book to lowest priority book in NextBooks)
        (set all club members as readed this book to true from UserBookDetail)
        - club_id : string (not null)
        - book_id : string (not null)
        - return : {readedbook} 
    
    - getCurrentBook : GET /api/club/:club_id/currentbook (need auth) (validate is member of club)
        - club_id : string (not null)
        - return : {currentbook}
    - setCurrentBook : POST /api/club/:club_id/currentbook (need auth) (validate is admin of club)
        - club_id : string (not null)
        - book_id : string (not null)
        - return : {currentbook}
    - removeCurrentBook : DELETE /api/club/:club_id/currentbook (need auth) (validate is admin of club)
        - club_id : string (not null)
        - return : {currentbook}

    - getClubInvitationCode : GET /api/club/:club_id/invitationcode (need auth) (validate is admin of club)
        - club_id : string (not null)
        - return : {invitationcode}
    - updateClubInvitationCode : POST /api/club/:club_id/invitationcode (need auth) (validate is admin of club)
        - club_id : string (not null)
        - return : {invitationcode}
    
    - getClubMeeting : GET /api/club/:club_id/meeting (need auth) (validate is member of club)
        - club_id : string (not null)
        - return : {meeting}
    - createClubMeeting : POST /api/club/:club_id/meeting (need auth) (validate is admin of club)
        - club_id : string (not null)
        - date_time : long (not null) (timestamp) (default : now) (in milliseconds) (UTC)
        - title : string (not null)
        - description : string (optional)
        - is_active : boolean (not null) (default : true)
        - meeting_url : string (optional)
        - return : {meeting}
    - updateClubMeeting : POST /api/club/:club_id/meeting (need auth) (validate is admin of club)
        - club_id : string (not null)
        - date_time : long (not null) (timestamp) (default : now) (in milliseconds) (UTC)
        - title : string (not null)
        - description : string (optional)
        - is_active : boolean (not null) (default : true)
        - meeting_url : string (optional)
        - return : {meeting}
    - deleteClubMeeting : DELETE /api/club/:club_id/meeting (need auth) (validate is admin of club)
        - club_id : string (not null)
        - return : {message}

    - getMemberWishes : GET /api/club/:club_id/memberwishes 
        (need auth) 
        (validate is admin of club)
        (get Member wishlist like member 1 -> userBookDetail[where -> isWishList = true] -> books)
        - club_id : string (not null)
        - return : {memberwishes}
    
    - changeBookPriority : POST /api/club/:club_id/nextbook/priority
        (need auth)
        (validate is admin of club)
        (change book priority in NextBooks)
        (if book is current book, then remove current book)
        (set current book to lowest priority book in NextBooks)
        - club_id : string (not null)
        - book_id : string (not null)
        - priority : int (not null)
        - return : {nextbooks}

    
*/

const clubService = require('../services/club-service');
const clubBooksService = require('../services/club-books-service');
const clubMembersService = require('../services/club-members-service');



// Club 

// need data 
// name : string (not null)
// description : string (optional)
// return : {club}

exports.createClub = (req, res) => {
    const { name, description } = req.body;
    const { admin_id } = req.userId;
    clubService.createClub({ name, description, admin_id })
        .then(club => { res.status(200).json(club) })
        .catch(err => { res.status(400).json(err) });
}

exports.joinClub = (req, res) => {
    const { club_id } = req.params;
    const { user_id } = req.userId;
    clubMembersService.createClubMember({ club_id, user_id })
        .then(club => {
            clubService.getClub(club_id)
                .then(club => { res.status(200).json(club) })
                .catch(err => { res.status(400).json(err) });
        })
        .catch(err => { res.status(400).json(err) });

}

exports.setClubHeaderImageUrl = (req, res) => {
    const { club_id } = req.params;
    const { header_image_url } = req.body;
    clubService.updateClub(club_id, { header_image_url })
        .then(club => { res.status(200).json(club) })
        .catch(err => { res.status(400).json(err) });
}


exports.addBookToList = (req, res) => {
    const { club_id, book_google_id } = req.body;
    const { user_id } = req.userId;
    let { priority } = req.body;
    if (!priority) priority = 0;
    // check book has already in club
    // check book has own database or just google if not add to database
    // add to database and get book if added get book
    // book add to club
    // return books in club

}

exports.setReadingBook = (req, res) => {
    const { club_id, book_id } = req.body;
    const { user_id } = req.userId;
    // check book is in club
    // check book is not current book
    // set book as current book
    // return current book
}

exports.readBook = (req, res) => {
    const { club_id, book_id } = req.body;
    const { user_id } = req.userId;


    // set club current reading book to next books highest priority book
    // set current book to readed book
}

exports.getCurrentBook = (req, res) => {
    const { club_id } = req.params;
    const { user_id } = req.userId;
    // get current book
}
exports.getAllBooks = (req, res) => {
    const { club_id } = req.params;
    const { user_id } = req.userId;
    // get all books
}
exports.getNextBooks = (req, res) => {
    const { club_id } = req.params;
    const { user_id } = req.userId;
    // get next books
}
exports.getReadedBooks = (req, res) => {
    const { club_id } = req.params;
    const { user_id } = req.userId;
    // get readed books
}

exports.getClubMembers = (req, res) => {
    const { club_id } = req.params;
    const { user_id } = req.userId;
    // get club members
}
exports.removeClubMember=(req,res)=>{

}
exports.leaveClub= (req,res)=>{
    
}
exports.getClubMembersWishListes = (req, res) => {
    const { club_id } = req.params;
    const { user_id } = req.userId;
    // get club members wish lists
    // ** none
}




// add header 
// add description

// add book to list
// remove book from list
// get books
// get next books
// get readed books

// selecet current book
// get current book
// remove current book

// readTheBook
// get member wishlist

// getClubAllDetails

