const express = require('express');
const back = express();
const port = 3000;

back.listen(port, () => console.log(`Listening on port ${port}`));

back.use(express.static('public'));

back.get('/', 
    (req, res) => {
        console.log(`Get: ${req.url}`);
        res.sendFile(`${__dirname}/index.html`);
    }
);

back.post('/',
    (req, res) => {
        console.log(`Post: ${req.url}`);
        res.send('Posted');
    }
);