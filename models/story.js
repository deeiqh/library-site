mongoose = require('mongoose');
Schema = mongoose.Schema;

const storySchema = new Schema({
    title: String,
    author: { type: Schema.Types.ObjectID, ref: 'Author'}
});

module.exports = mongoose.model('Story', storySchema);