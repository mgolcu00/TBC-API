
 -- /Users/mertgolcu/Documents/TheBookClub/backend/nodejs/pg_app/database/exec2.sql
 -- CREATE
 
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --CREATE DATABASE tbccdb;

-- CREATE TABLE IF NOT EXISTS users(
--     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     username TEXT NOT NULL,
--     password TEXT NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     role TEXT DEFAULT 'user',
--     avatar_url TEXT,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS clubs(
--     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name TEXT NOT NULL,
--     admin_id uuid NOT NULL,
--     invitation_code TEXT NOT NULL,
--     header_image_url TEXT,
--     description TEXT,
--     current_book_id uuid,
--     next_book_id uuid
-- );

-- CREATE TABLE IF NOT EXISTS books(
--     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     google_id TEXT NOT NULL,
--     title TEXT NOT NULL,
--     author TEXT NOT NULL,
--     description TEXT,
--     image_url TEXT,
--     page_count INT
-- );

-- CREATE TABLE IF NOT EXISTS user_book_details(
--     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     user_id uuid NOT NULL,
--     book_id uuid NOT NULL,
--     is_read BOOLEAN NOT NULL DEFAULT false,
--     is_favorite BOOLEAN NOT NULL DEFAULT false,
--     is_wish BOOLEAN NOT NULL DEFAULT false
-- );

-- CREATE TABLE IF NOT EXISTS meetings(
--     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     club_id uuid NOT NULL,
--     date_time BIGINT NOT NULL,
--     title TEXT NOT NULL,
--     description TEXT,
--     isActive BOOLEAN NOT NULL DEFAULT false,
--     meeting_url TEXT
-- );

-- CREATE TABLE IF NOT EXISTS club_members(
--     club_id uuid NOT NULL,
--     user_id uuid NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS club_next_books(
--     club_id uuid NOT NULL,
--     book_id uuid NOT NULL,
--     priority INT NOT NULL DEFAULT 0
-- );

-- CREATE TABLE IF NOT EXISTS club_readed_books(
--     club_id uuid NOT NULL,
--     book_id uuid NOT NULL,
--     readed_date BIGINT NOT NULL
-- );
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



