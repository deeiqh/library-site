const BookInstance = require('../models/book-instance');
const Book = require('../models/book');
const {body, validationResult} = require('express-validator');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
    BookInstance
        .find()
        .populate('book')
        .sort('book.name')
        .exec((error, result) => {
            if (error) next(error);
            else {
                res.render('book-instance-list', {instances: result})
            }
        })
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    const bookInstance = req.params.id;
    BookInstance
        .find({_id: bookInstance})
        .populate('book')
        .exec((error, instance) => {
            error ?
                next(error)
                : res.render('book-instance-detail', {data: instance});
        })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    Book
        .find()
        .exec((error, books) => {
            error ? 
                next(error)
                : res.render('book-instance-create', {books: books});
        });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body('book').escape(),
    body('imprint').isLength({min: 1}).withMessage('Can not be empty.').escape(),
    body('dueBack').escape(),
    body('status').escape(),

    function(req, res, next) {
        console.log(req.body)
        
        errors = validationResult(req);
        if(!errors.isEmpty()) {
            errorsMessages = {};
            errors.array().forEach( e => {
                errorsMessages[e.param] = e.msg;
            });
            console.log('ERORRS ', errorsMessages)
            
            Book
                .find()
                .exec((error, books) => {
                    error ? 
                        next(error)
                        : res.render('book-instance-create', {books: books, body: req.body, errors: errorsMessages});
                });
        } else {
            BookInstance
                .findOne({
                    book: req.body.book,
                    imprint: req.body.imprint,
                    status: req.body.status,
                    due_back: req.body.due_back
                })
                .exec((error, found) => {
                    console.log('FOUND ',found)
                    if (error) next(error);
                    else {
                        if (found) {
                            res.redirect(found.url);
                        }
                        else {
                            const bookInstance = new BookInstance({
                                book: req.body.book,
                                imprint: req.body.imprint,
                                status: req.body.status,
                                due_back: req.body.due_back
                            });
                            bookInstance.save(error => {
                                if (error) next(error);
                                else 
                                    res.redirect(bookInstance.url);
                            })
                        }
                    }
                })
        }
    }
]

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};
