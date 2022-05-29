const express = require('express');

const operations = require('./public/operations.js');
const object = require('./public/object.js');
const foo = require('./public/function.js');
const wiki = require('./public/wiki.js');

const back = express();
const port = 3000;

back.listen(port, () => console.log(`Listening on port ${port}`));

back.use(express.static('./public'));

// back.get('/',
//     (req, res) => {
//         console.log(`Get: ${req.url}`);
//         res.sendFile(`${__dirname}/index.html`);
//     }
// );

back.post('/',
    (req, res) => {
        console.log(`Post: ${req.url}`);
        res.send('Posted');
    }
);

back.get('/operate',
    (req, res, next) => {
        console.log(`NEXT`);
        next();
    }
);

back.get('/operate',
    (req, res) => {
        console.log(`Request from ${req.url}`);
        res.send(`${operations.square(4)} ${object.subtractTwo(2)} ${foo(-2)}`);
    }
);

// back.get('/operate',
//     (req, res, next) => {
//         console.log(`NEXT`);
//         next();
//     }
// );

back.use('/wiki', wiki);