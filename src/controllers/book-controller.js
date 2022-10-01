const BookService = require('../services/book-service');
const axios = require('axios');

const listToString = (list) => {
    let str = '';
    for (let i = 0; i < list.length; i++) {
        str += list[i];
        if (i < list.length - 1) {
            str += ', ';
        }
    }
    return str;
}
exports.addBookFromGoogle = (req, res) => {
    const { googleId } = req.body;
    // nodejs axios
    axios.get(`https://www.googleapis.com/books/v1/volumes/${googleId}`)
        .then(response => {
            console.log(response.data);
            const book = response.data;
            const { title, authors, description, imageLinks, pageCount } = book.volumeInfo;
            const google_id = book.id;
            const author = authors ? listToString(authors) : '';
            const image_url = imageLinks ? imageLinks.thumbnail : '';
            const page_count = pageCount ? pageCount : 0;
            const newBook = {
                google_id,
                title,
                author,
                description,
                image_url,
                page_count
            };
            BookService.createBook(newBook)
                .then(book => {
                    res.status(200).send(book);
                }
                )
                .catch(err => {
                    res.status(500).send({ message: err });
                }
                );
        })
        .catch(err => {
            res.status(500).send({ message: err });
        }
        );
}

exports.createBook = (req, res) => {
    const { google_id, title, author, description, image_url, page_count } = req.body;
    BookService.createBook(req.body)
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
