const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/book-instance');

const async = require('async');

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
exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

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
