const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');

exports.author_list = (req, res, next) => {
    Author
        .find()
        .sort({first_name: 'asc'})
        .exec((error, authors) => {
            if (error) next(error);
            else {
                res.render('author-list', {data: authors});
            }
        })
};

exports.author_detail = (req, res, next) => {
    const author = req.params.id;
    async.parallel({
        author: callback => {
            Author
                .find({_id: author})
                .exec(callback)
        },
        books: callback => {
            Book
                .find({author: author})
                .select('title summary')
                .sort({title: 'asc'})
                .exec(callback)
        }
    }, (error, results) => {
        error ?
            next(error)
            : res.render('author-detail', {data: results});
    })
};

exports.author_create_get = (req, res) => {
    res.send('author_create_get');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};