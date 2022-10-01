-- get FROM plan.js





/* Models

User :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - email : string (unique) (not null)
    - username : string (unique) (not null)
    - role : string (optional) (default : user)
    - password : string (not null)
    - avatar_url : string (optional)
    - created_at : timestamp (generated) (not null)
    - updated_at : timestamp (generated) (not null)


Club :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - name : string (not null)
    - admin_id : string (FK) (not null)
    - invitation_code : string (unique) (not null) (generated)
    - header_image_url : string (optional) 
    - description : string (optional)
    - current_book_id : string (optional) (FK)
    - next_book_id : string (optional) (FK)

Book :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - google_id : string (unique) (not null)
    - title : string (not null)
    - author : string (not null)
    - description : string (optional)
    - image_url : string (optional)
    - page_count : int (optional)

UserBookDetail :
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - user_id : string (FK) (not null)
    - book_id : string (FK) (not null)
    - is_read : boolean (not null) (default false)
    - is_favorite : boolean (not null) (default false)
    - is_wish : boolean (not null) (default false)
// user click a book, then add favorite or wish or read
// then if user_id and book_id is exist in UserBookDetail, then update is_read, is_favorite, is_wish
// else insert new row
// if user click a book, then remove favorite or wish or read
// then if user_id and book_id is exist in UserBookDetail, then update is_read, is_favorite, is_wish
// else send error
// get user favorited books from UserBookDetail with UserBookDetail.is_favorite = true

Meeting : 
    - id : string (UUID) (PK) (unique) (generated) (not null)
    - club_id : string (FK) (not null)
    - date_time : long (not null) (unix timestamp)
    - title : string (not null)
    - description : string (optional)
    - isActive : boolean (default : false) (not null) 
    - meeting_url : string (optional)

ClubMembers : 
    - club_id : string (FK) (not null)
    - user_id : string (FK) (not null)

ClubBooks : (deprecated)
    - club_id : string (FK) (not null)
    - book_id : string (FK) (not null)

ClubNextBooks :
    - club_id : string (FK) (not null)
    - book_id : string (FK) (not null)
    - priority : int (not null) (default : 0)

ClubReadedBooks :
    - club_id : string (FK) (not null)
    - book_id : string (FK) (not null)
    - readed_date : long (not null) (unix timestamp)



TOKEN : (NOT IN DATABASE)
    - access_token : string
    - refresh_token : string
    - expiration_time : long

MESSAGE : (NOT IN DATABASE)
    - message : string (not null)
    - code : int (not null)
    - type : string (not null) (success, error, warning, info)
    - title : string (optional)
    - helper : string (optional)
*/

--

-- CREATE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE tbcdb;

CREATE TABLE IF NOT EXISTS users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clubs(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    admin_id uuid NOT NULL,
    invitation_code TEXT NOT NULL,
    header_image_url TEXT,
    description TEXT,
    current_book_id uuid,
    next_book_id uuid
);

CREATE TABLE IF NOT EXISTS books(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    page_count INT
);

CREATE TABLE IF NOT EXISTS user_book_details(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    book_id uuid NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    is_wish BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS meetings(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id uuid NOT NULL,
    date_time BIGINT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT false,
    meeting_url TEXT
);

CREATE TABLE IF NOT EXISTS club_members(
    club_id uuid NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS club_next_books(
    club_id uuid NOT NULL,
    book_id uuid NOT NULL,
    priority INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS club_readed_books(
    club_id uuid NOT NULL,
    book_id uuid NOT NULL,
    readed_date BIGINT NOT NULL
);

--

CREATE UNIQUE INDEX IF NOT EXISTS username_unique ON users(username);
CREATE UNIQUE INDEX IF NOT EXISTS email_unique ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS invitation_code_unique ON clubs(invitation_code);
CREATE UNIQUE INDEX IF NOT EXISTS google_id_unique ON books(google_id);
CREATE UNIQUE INDEX IF NOT EXISTS club_member_unique ON club_members(club_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS club_next_book_unique ON club_next_books(club_id, book_id);
CREATE UNIQUE INDEX IF NOT EXISTS club_readed_book_unique ON club_readed_books(club_id, book_id);
CREATE INDEX IF NOT EXISTS club_admin_id_index ON clubs(admin_id);
CREATE INDEX IF NOT EXISTS club_current_book_id_index ON clubs(current_book_id);
CREATE INDEX IF NOT EXISTS club_next_book_id_index ON clubs(next_book_id);
CREATE INDEX IF NOT EXISTS user_book_detail_user_id_index ON user_book_details(user_id);
CREATE INDEX IF NOT EXISTS user_book_detail_book_id_index ON user_book_details(book_id);
CREATE INDEX IF NOT EXISTS meeting_club_id_index ON meetings(club_id);
CREATE INDEX IF NOT EXISTS club_member_user_id_index ON club_members(user_id);


-- INSERTS

INSERT INTO users(username, password, email, role, avatar_url) VALUES('admin', 'admin', 'adm@email.com', 'admin', 'https://i.imgur.com/1Q9ZQ9r.jpg');
INSERT INTO users(username, password, email, role, avatar_url) VALUES('user', 'user', 'usr@email.com', 'user', 'https://i.imgur.com/1Q9ZQ9r.jpg');

--INSERT INTO clubs(name, admin_id, invitation_code, header_image_url, description) VALUES('Club 1', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '123456', 'https://i.imgur.com/1Q9ZQ9r.jpg', 'Club 1 description');
--INSERT INTO clubs(name, admin_id, invitation_code, header_image_url, description) VALUES('Club 2', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '654321', 'https://i.imgur.com/1Q9ZQ9r.jpg', 'Club 2 description');

INSERT INTO books(google_id, title, author, description, image_url, page_count) VALUES('uoEF6w6Gk_wC', 'Book 1', 'Author 1', 'Book 1 description', 'https://i.imgur.com/1Q9ZQ9r.jpg', 100);
INSERT INTO books(google_id, title, author, description, image_url, page_count) VALUES('gJMozwEACAAJ', 'Book 2', 'Author 2', 'Book 2 description', 'https://i.imgur.com/1Q9ZQ9r.jpg', 200);

--INSERT INTO user_book_details(user_id, book_id, is_read, is_favorite, is_wish) VALUES('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', true, true, false);
--INSERT INTO user_book_details(user_id, book_id, is_read, is_favorite, is_wish) VALUES('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', false, false, true);







-- CREATE TRIGGER IF CLUB CREATED, THEN CREATE A NEW INVITATION CODE
CREATE OR REPLACE FUNCTION generate_invitation_code() RETURNS TRIGGER AS $$
BEGIN
    NEW.invitation_code = md5(NEW.id::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_invitation_code
    BEFORE INSERT ON clubs
    FOR EACH ROW
    EXECUTE PROCEDURE generate_invitation_code();

-- CREATE TRIGGER IF CLUB CREATED, THEN ADD ADMIN TO MEMBERS
CREATE OR REPLACE FUNCTION add_admin_to_members() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO club_members(club_id, user_id) VALUES (NEW.id, NEW.admin_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_admin_to_members
    AFTER INSERT ON clubs
    FOR EACH ROW
    EXECUTE PROCEDURE add_admin_to_members();




-- EXAMPLE CLUB ID : 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
-- SELECT CLUB MEMBERS
SELECT users.id, users.username, users.email, users.role, users.avatar_url, users.created_at, users.updated_at
FROM users
INNER JOIN club_members ON users.id = club_members.user_id
WHERE club_members.club_id = '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p';

-- SELECT CLUB BOOKS
SELECT books.id, books.google_id, books.title, books.author, books.description, books.image_url, books.page_count
FROM books
INNER JOIN club_next_books ON books.id = club_next_books.book_id
WHERE club_next_books.club_id = '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p';

-- SELECT CLUB READED BOOKS
SELECT books.id, books.google_id, books.title, books.author, books.description, books.image_url, books.page_count, club_readed_books.readed_date
FROM books
INNER JOIN club_readed_books ON books.id = club_readed_books.book_id
WHERE club_readed_books.club_id = '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p';

-- SELECT CLUB MEETING
SELECT meetings.id, meetings.club_id, meetings.date_time, meetings.title, meetings.description, meetings.isActive, meetings.meeting_url
FROM meetings
WHERE meetings.club_id = '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p';
