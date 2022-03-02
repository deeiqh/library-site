const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookInstance = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint: {type: String, required: true},
    status: {type: String, enum: ['Available', 'Maintenance', 'Loaned'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
});

BookInstance
    .virtual('url')
    .get(function(){
        return '/catalog/book-instance/' + this._id;
    });

module.exports = mongoose.model('BookInstance', BookInstance);