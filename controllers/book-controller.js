const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/book-instance');

const async = require('async');
const author = require('../models/author');

const {body, validationResult} = require('express-validator');

exports.index = function(req, res) {
    // Book.countDocuments({title: 'The Name of the Wind (The Kingkiller Chronicle, #1)'}, (error, result) => {
    //     error ? console.log('error: ', error) : console.log('result: ', result);
    // })

    async.parallel({
        book_count: callback => Book.countDocuments({}, callback),
        book_instance_count: callback => BookInstance.countDocuments({}, callback),
        book_instance_available_count: callback => BookInstance.countDocuments({status: 'Available'}, callback),
        author_count: callback => Author.countDocuments({}, callback),
        genre_count: callback => Genre.countDocuments({}, callback),
    }, (error, results) => 
        error ? console.log('error: ', error) : res.render('index', {title: 'Library Home', error: error, data: results})
    );
};

// Display list of all books.
exports.book_list = function(req, res) {
    Book
        .find()
        .select('title author')
        .sort('title')
        .populate('author')
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error);
            } else {
                res.render('book-list', {title: 'Book List', data: result});
            }
        });

    /*
    async.waterfall([
        callback => {
            Book
                .find()
                .select('title author')
                .sort({title: 1})
                .exec((error, result) => {
                    error ? callback(error, null) : callback(null, result);
                });
                
        },
        (books, callback) => {
            
            console.log('BBBOOOOOOKKKKKKSSS', books);
            let results = {book: [], first_name: [], family_name: []};

            let query = function (book, callback){
                Author
                    .find({_id: book.author})
                    .select('first_name family_name')
                    .exec((error, result) => {
                        if (error) {
                            console.log('error: ', error);
                            callback(error, null);
                        } else {
                            console.log('RESULTS', results);
                            console.log('RESULT', result);
                            results.book.push(book.title);
                            results.first_name.push(result[0].first_name);
                            results.family_name.push(result[0].family_name);
                            if (callback) callback(null, results);
                        }
                    });
            };

            for (let i=0; i<books.length-1; i++) {
                query(books[i]);
            }

            query(books[books.length-1], callback);
            
        }
    ], (err, results) => {
        err ? res.send('error listing books') : res.render('book-list', {data: results});
    });
    */
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    const book = req.params.id;
    async.parallel({
        book: callback => {
            Book    
                .find({_id: book})
                .populate('author')
                .populate('genre')
                .exec(callback);

        },
        instance: callback => {
            BookInstance
                .find({book: book})
                .exec(callback)
        }
    }, (error, results) => {
        error ?
            next(error)
            : res.render('book-detail', {data: results});
    });
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
    async.parallel ({
        authors: callback => {
            Author
                .find()
                .sort({first_name: 1})
                .exec(callback);
        },
        genres: callback => {
            Genre
                .find()
                .sort({name: 1})
                .exec(callback);
        }
    }, (error, results) => {
        error ? 
            next(error)
            : res.render('book-create', {authors: results.authors, genres: results.genres})
    })
};

// Handle book create on POST.
exports.book_create_post = [
    body('isbn').matches(/ISBN\d{2}/).withMessage('ISBN does not match.'), 

    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorData = {};
            errors.array().forEach(obj => {
                errorData[obj.param] = {msg: obj.msg};
            })
            async.parallel({
                authors: callback => {
                    Author
                        .find()
                        .sort({first_name: 1})
                        .exec(callback)
                },
                genres: callback => {
                    Genre
                        .find()
                        .sort({name: 1})
                        .exec(callback)
                }
            }, (error, result) => {
                if (error) next(error)
                else {
                    console.log(req.body)
                    for (let i=0; i < result.genres.length; i++) {
                        if (req.body.genre.indexOf(result.genres[i]._id.toString()) > -1) {
                            result.genres[i].checked = true;
                        }
                    }                 
                    console.log(result.authors)
                    res.render('book-create', {
                        body: req.body, 
                        authors: result.authors,
                        genres: result.genres,
                        errors: errorData,
                    });
                }
            });
        } else {
            const book = new Book({
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                genre: req.body.genre,
                isbn: req.body.isbn
            });          

            Book
                .findOne({
                    title: book.title,
                    author: book.author,
                    summary: book.summary,
                    genres: book.genre,
                    isbn: book.isbn
                })
                .exec((error, found) => {
                    if (error) next(error);
                    else {
                        if (found) res.redirect(book.url)
                        else {
                            book.save(error => {
                                error ?
                                next(error)
                                : res.redirect(book.url);
                            })
                        }
                    }
                });
        }
    }
]

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
