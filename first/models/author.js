const mongoose = require('mongoose');
const {DateTime} = require('luxon');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema ({
    first_name: {type: String, maxLength: 100, required: true},
    family_name: {type: String, maxLength: 100, required: true},
    date_of_birth: Date,
    date_of_death: {type: Date}
});

AuthorSchema
    .virtual('name')
    .get(function() {
        let fullname = '';
        if (this.first_name && this.family_name) {
            fullname = this.first_name + ' ' + this.family_name;
        }
        return fullname;
    });

AuthorSchema
    .virtual('lifespan')
    .get(function() {
        let lifespan = '';

        this.date_of_birth ? 
            //lifespan += this.date_of_death.getYear().toString()
            lifespan += DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_SHORT) 
            : lifespan += '?';

        lifespan += ' - ';

        this.date_of_death ?
            //lifespan += this.date_of_death.getYear().toString();
            lifespan += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_SHORT)
            : lifespan += '?';
            
        return lifespan;
    });

AuthorSchema
    .virtual('url')
    .get(function() {
        return '/catalog/author/' + this._id;
    });

module.exports = mongoose.model('Author', AuthorSchema);
