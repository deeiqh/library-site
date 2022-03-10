const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const {body, validationResult} = require('express-validator');

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
    res.render('author-create', {title: 'Create author'});
};

// Handle Author create on POST.
exports.author_create_post = [
    body('firstName')
        .trim().isLength({min: 2, max: 100}).withMessage('Too short or too long first name').escape(),
    body('familyName')
        .trim().isLength({min: 2, max: 100}).withMessage('Too short or too long family name').escape(),
    body('dateOfBirth')
        .isDate().withMessage('Date of Birth is not a date.'),
    body('date_of_death').optional({ checkFalsy: true }),

    function(req, res, next) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            let errorData = {};
            errors.array().forEach(obj => errorData[obj.param] = {
                value: obj.value, msg: obj.msg
            });
            res.render('author-create', {body: req.body, errors: errorData})
        } else {
            const author = new Author({
                first_name: req.body.firstName,
                family_name: req.body.familyName,
                date_of_birth: req.body.dateOfBirth,
                date_of_death: req.body.dateOfDeath
            });
            Author
                .findOne({
                    first_name: author.first_name,
                    family_name: author.family_name,
                    date_of_birth: author.date_of_birth,
                    date_of_death: author.date_of_death
                })
                .exec((error, found) => {
                    if (error) next(error);
                    else if (found) {
                        res.redirect(author.url)
                    } else {
                        author.save(error => {
                            error ? next(error) : res.redirect(author.url);
                        })
                    }
                })
        }
    }
]

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