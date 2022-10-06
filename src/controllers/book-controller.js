const BookService = require('../services/book-service');
const axios = require('axios');


exports.addBookFromGoogle = (req, res) => {
    const { googleId } = req.body;
    // nodejs axios
    BookService.getBookByGoogleId(googleId)
        .then(book => {
            res.status(200).json(book);
        } )
        .catch(err => {
            res.status(500).json(err);
        });
}

exports.createBook = (req, res) => {
    const { google_id, title, author, description, image_url, page_count } = req.body;
    BookService.createBook({ google_id, title, author, description, image_url, page_count })
        .then(book => {
            res.status(200).send(book);
        }
        )
        .catch(err => {
            res.status(500).send({ message: err });
        }
        );
}

exports.getBookByGoogleId = (req, res) => {
    const { google_id } = req.params;
    BookService.getBookByGoogleId(google_id)
        .then(book => {
            res.status(200).send(book);
        }
        )
        .catch(err => {
            res.status(500).send({ message: err });
        }
        );
}

exports.getBookWithQuery = (req, res) => {
    const { query } = req.params;
    BookService.getBookWithQuery(query)
        .then(book => {
            res.status(200).send(book);
        }
        )
        .catch(err => {
            res.status(500).send({ message: err });
        }
        );
}

exports.getAllBooks = (req, res) => {
    BookService.getAllBooks()
        .then(books => {
            res.status(200).send(books);
        }
        )
        .catch(err => {
            res.status(500).send({ message: err });
        }
        );
}

exports.getBookById = (req, res) => {
    const { id } = req.params;
    BookService.getBookById(id)
        .then(book => {
            res.status(200).send(book);
        }
        )
        .catch(err => {
            res.status(500).send({ message: err });
        }
        );
}
