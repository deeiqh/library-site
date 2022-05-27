const args = process.argv.splice(2);
const mongoDB = args[0];

const async = require('async');
const mongoose = require('mongoose');

const Book = require('./models/book');
const Author = require('./models/author');
const Genre = require('./models/genre');
const BookInstance = require('./models/book-instance');

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', () => console.log('errorr'));

let books = [];
let authors = [];
let genres = [];
let bookinstances = [];

function message(error, modelString) {
    error ? console.log('Error creating ' + modelString +': ', error) : console.log(modelString + ' created');
}

function authorCreate(first_name, family_name, date_of_birth, date_of_death, callback) {
    const authorDetail = { first_name: first_name, family_name: family_name};
    if (date_of_birth) authorDetail.date_of_birth = date_of_birth;
    if (date_of_death) authorDetail.date_of_death = date_of_death;

    const author = new Author(authorDetail);
    author.save(error => {message(error, 'author'); callback();});
    authors.push(author);
}

function genreCreate(name, callback) {    
    const genreDetails = {name: name};

    const genre = new Genre(genreDetails);
    genre.save(error => {message(error, 'genre'); callback();});
    genres.push(genre);
}

function bookCreate(title, summary, isbn, author, genre, callback) {
    const bookDetail = { title: title, author: author, summary: summary, isbn: isbn};
    if (genre) bookDetail.genre = genre;

    const book = new Book(bookDetail);
    book.save(error => {message(error, 'book'); callback();});
    books.push(book);
}

function bookInstanceCreate(book, imprint, due_back, status, callback) {
    const bookInstance = new BookInstance({book: book, imprint: imprint});
    if (due_back) bookInstance.due_back = due_back;
    if (status) bookInstance.status = status;
    bookInstance.save(error => {message(error, 'book instance'); callback();});
    
    bookinstances.push(bookInstance);
}

function createAuthors(cb) {
    async.parallel([
        callback => authorCreate('Patrick', 'Rothfuss', '1973-06-06', false, callback),
        callback => authorCreate('Ben', 'Bova', '1932-11-8', false, callback),
        callback => authorCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback),
        callback => authorCreate('Bob', 'Billings', false, false, callback),
        callback => authorCreate('Jim', 'Jones', '1971-12-16', false, callback)
    ],
        error => {
            message(error, 'authors');
            cb();
        }
    );
}

function createGenres(cb) {
    async.parallel([
        callback => genreCreate('Fantasy', callback),
        callback => genreCreate('Science Fiction', callback),
        callback => genreCreate('French Poetry', callback)
    ],
        error => {
            message(error, 'genres');
            cb();
        }
    );
}

function createBooks(cb) {
    async.parallel([
        callback => bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', authors[0], [genres[0]], callback),
        callback => bookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', authors[0], [genres[0]], callback),
        callback => bookCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', authors[0], [genres[0]], callback),
        callback => bookCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', authors[1], [genres[1]], callback),
        callback => bookCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', authors[1], [genres[1]], callback),
        callback => bookCreate('Test Book 1', 'Summary of test book 1', 'ISBN111111', authors[4], [genres[0],genres[1]], callback),
        callback => bookCreate('Test Book 2', 'Summary of test book 2', 'ISBN222222', authors[4], false, callback)
    ],     
        error => {
            message(error, 'books');
            cb();
        }
    );
}

function createBookInstances(cb) {
    async.parallel([
        callback => bookInstanceCreate(books[0], 'London Gollancz, 2014.', false, 'Available', callback),
        callback => bookInstanceCreate(books[1], ' Gollancz, 2011.', false, 'Loaned', callback),
        callback => bookInstanceCreate(books[2], ' Gollancz, 2015.', false, false, callback),
        callback => bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback),
        callback => bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback),
        callback => bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback),
        callback => bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Available', callback),
        callback => bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Maintenance', callback),
        callback => bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Loaned', callback),
        callback => bookInstanceCreate(books[0], 'Imprint XXX2', false, false, callback),
        callback => bookInstanceCreate(books[1], 'Imprint XXX3', false, false, callback)
    ],
        error => {
            message(error, 'book instances');
            cb();
        }
    );
}

async.series([
    cb => createAuthors(cb),
    cb => createGenres(cb),
    cb => createBooks(cb),
    cb => createBookInstances(cb)
], error => {
    message(error, 'populating');
    mongoose.connection.close();
});
