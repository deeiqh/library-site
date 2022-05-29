const express = require('express');
const router = express.Router();

router.get('/', 
    (req, res) => {
        console.log(`Request from ${req.url}`);
        res.send('Wiki docs');
    }
);

module.exports = router;