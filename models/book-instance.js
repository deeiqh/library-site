const mongoose = require('mongoose');
const  { DateTime }  = require('luxon');
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

BookInstance
    .virtual('due_back_formatted')
    .get(function() {
        return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
    })

module.exports = mongoose.model('BookInstance', BookInstance);