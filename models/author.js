const mongoose = require('mongoose');
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
        if (this.date_of_birth) {
            lifespan += this.date_of_birth.getYear().toString();
        }
        lifespan += ' - ';
        if (this.date_of_death) {
            lifespan += this.date_of_death.getYear().toString();
        }
        return lifespan;
    });

AuthorSchema
    .virtual('url')
    .get(function() {
        return '/catalog/author/' + this._id;
    });

module.export = mongoose.model('Author', AuthorSchema);
