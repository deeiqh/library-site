const Genre = require('../models/genre');
const Books = require('../models/book');
const async = require('async');
const {body, validationResult} = require('express-validator');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre
        .find()
        .sort({name: 'asc'})
        .exec((error, genres) => {
            error ? 
                next(error)
                : res.render('genre-list', {data: genres});
        })
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    const genre = req.params.id;
    async.parallel({
        genre: (callback) => {
            Genre
                .find({_id: genre})
                .select('name')
                .exec(callback);
        },
        books: (callback) => {
            Books
                .find({genre: genre})
                .select('title summary')
                .exec(callback)
        }
    }, (error, results) => {
        error ?
            next(error)
            : res.render('genre-detail', {data: results});
    });
    
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.render('genre-form', {title: 'Create genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    body('name', 'Genre name required')
        .trim().isLength({ min: 1}).withMessage('Name?')
        .isAlpha().withMessage('Not numbers.').escape(),
    function(req, res, next) {
        const errors = validationResult(req);
        //console.log(errors.array()[0].msg);
        if (errors.isEmpty()) {
            const genre = new Genre({name: req.body.name});
            Genre
                .findOne({name: genre.name})
                .exec((error, found) => {
                    if (error) {
                        next(error);
                    }else if (found) {
                        res.redirect(genre.url);
                    } else {
                        genre.save(error => { 
                            error ? next(error) : res.redirect(genre.url);
                        });
                    }
                })
        } else {
            res.render('genre-form', {title: 'Create genre', genre: req.body.name, errors: errors.array() });
        }
    }
]
// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
