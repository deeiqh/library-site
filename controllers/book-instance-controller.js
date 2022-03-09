const BookInstance = require('../models/book-instance');

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
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

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
